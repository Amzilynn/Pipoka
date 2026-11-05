import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
const context = await browser.newContext({ permissions: ['camera', 'microphone'], viewport: { width: 1366, height: 1000 } });
await context.addInitScript(() => {
  window.__spoken = [];
  window.speechSynthesis.speak = text => { window.__spoken.push(text.text); text.onend?.(); };
  window.speechSynthesis.cancel = () => {};
  window.SpeechRecognition = class {
    start() { window.__recognition = this; this.onstart?.(); }
    abort() { this.onerror?.({ error: 'aborted' }); this.onend?.(); }
  };
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let verdict = 'retry';
let checks = 0;
await page.route('**/api/calendar/verify', route => {
  checks++;
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
    verdict, confidence: verdict === 'verified' ? 0.96 : 0.99,
    feedback: verdict === 'verified' ? 'Bravo, le cahier est dans le sac !' : 'Montre le cahier à l’intérieur du sac.',
    model: 'browser-test',
  }) });
});
const base = process.env.CALENDAR_TEST_URL || 'http://localhost:5174';
try {
  await page.goto(base + '/enfant/calendrier');
  await page.getByRole('heading', { name: 'Une journée toute tranquille' }).waitFor();
  // Photo checks use an explicit test fixture rather than a production demo.
  await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open('bublii-calendar', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('tasks', 'readwrite');
      const date = new Date();
      transaction.objectStore('tasks').put({ id: 'browser-test-bag', childId: 'local-child',
        date: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`,
        title: 'Je prépare mon sac', picture: 'cahier', time: '', steps: [
          { id: 'test-notebook', title: 'Je mets mon cahier dans mon sac', instruction: 'Montre le cahier dans le sac.' },
          { id: 'test-pencil-case', title: 'Je mets ma trousse dans mon sac', instruction: 'Montre la trousse dans le sac.' },
          { id: 'test-close-bag', title: 'Je ferme mon sac', instruction: 'Montre le sac fermé.' },
        ] });
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  });
  await page.reload();
  await page.getByRole('heading', { name: 'Je prépare mon sac', exact: true }).waitFor();
  assert.equal(await page.locator('.calendar-step.is-active').count(), 1);
  assert.equal(await page.locator('.calendar-step.is-locked').count(), 0);
  await page.getByRole('button', { name: 'Écouter', exact: true }).first().click();
  assert.match(await page.evaluate(() => window.__spoken.at(-1)), /cahier/);
  await page.getByText('Aide et informations', { exact: true }).click();
  await page.getByRole('button', { name: 'Parler', exact: true }).click();
  await page.evaluate(() => { const recognition = window.__recognition; recognition.onresult({ results: [[{ transcript: 'demain' }]] }); recognition.onend(); });
  await page.getByRole('heading', { name: 'Une journée toute tranquille' }).waitFor();
  await page.getByRole('button', { name: 'Aujourd’hui', exact: true }).click();
  await page.getByRole('button', { name: 'Prendre une photo', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  await dialog.getByRole('button', { name: 'Prendre la photo', exact: false }).click();
  await page.getByText('Montre le cahier à l’intérieur du sac.', { exact: true }).waitFor();
  assert.equal(await page.locator('.calendar-step.is-done').count(), 0);
  assert.equal(await page.locator('.calendar-step.is-locked').count(), 0);
  verdict = 'verified';
  await page.getByRole('button', { name: 'Prendre une photo', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Prendre la photo', exact: false }).click();
  await page.getByRole('heading', { name: 'Je mets ma trousse dans mon sac', exact: true }).waitFor();
  await page.getByText('Étape 2 sur 3', { exact: true }).waitFor();
  assert.equal(await page.locator('.calendar-step').count(), 1);
  await page.reload();
  await page.getByText('Étape 2 sur 3', { exact: true }).waitFor();
  assert.equal(await page.locator('.calendar-step.is-active').count(), 1);
  await mkdir('artifacts/calendar', { recursive: true });
  await page.screenshot({ path: 'artifacts/calendar/desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: 'artifacts/calendar/mobile.png', fullPage: true });
  await page.goto(base + '/parent/calendrier');
  await page.getByRole('button', { name: 'Ajouter une tâche', exact: false }).click();
  await page.getByRole('group', { name: 'Image de l’activité', exact: true }).getByRole('button', { name: 'Lire', exact: true }).click();
  await page.getByRole('group', { name: 'Image de l’étape 1', exact: true }).getByRole('button', { name: 'Ranger', exact: true }).click();
  await page.getByLabel('Heure (facultatif)').fill('09:30');
  await page.getByLabel('Nom de la tâche').fill('Je range mon livre');
  await page.getByLabel('Que faut-il faire ?').fill('Je range mon livre sur l’étagère');
  await page.getByLabel('Que doit-on voir sur la photo ?').fill('Le livre est posé sur l’étagère.');
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click();
  await page.getByRole('heading', { name: 'Je range mon livre', exact: true }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'Prendre une photo', exact: true }).count(), 0);
  await page.goto(base + '/enfant/calendrier');
  const planned = page.locator('.calendar-mission').filter({ has: page.getByRole('heading', { name: 'Je range mon livre', exact: true }) });
  await planned.waitFor();
  assert.match(await page.locator('.child-calendar-task[aria-current=step] img').getAttribute('src'), /histoire.svg$/);
  assert.match(await planned.locator('.calendar-step .calendar-activity-picture').getAttribute('src'), /ranger.svg$/);
  assert.match(await planned.innerText(), /09:30/);
  assert.equal(await page.getByRole('button', { name: 'Ajouter une tâche', exact: false }).count(), 0);
  assert.equal(await page.locator('.child-calendar-days>button').count(), 2);
  assert.equal(await page.locator('.calendar-month-panel').count(), 0);
  assert.equal(await page.locator('.day-example').isVisible(), false);
  assert.equal(await page.locator('.calendar-step').count(), 1);
  assert.equal(await page.locator('.calendar-activity-picture').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)), true);
  await page.screenshot({ path: 'artifacts/calendar/child-picture-list.png', fullPage: true });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.equal(checks, 2);
  await page.getByText('Adapter l’affichage', { exact: true }).click();
  await page.getByRole('button', { name: 'Texte plus grand' }).click();
  await page.getByRole('button', { name: 'Voir toutes les étapes' }).click();
  await page.reload();
  await page.getByRole('heading', { name: 'Je range mon livre', exact: true }).waitFor();
  assert.equal(await page.locator('.child-calendar-large').count(), 1);
  assert.equal(await page.locator('.child-calendar-overview').count(), 1);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.getByText('Voir un exemple en photos', { exact: true }).click();
  await page.getByRole('button', { name: 'Étape 1 : Je prends ma carte', exact: true }).click();
  await page.getByRole('button', { name: 'Écouter l’étape 1', exact: true }).click();
  assert.match(await page.evaluate(() => window.__spoken.at(-1)), /carte de transport/);
  await page.getByRole('button', { name: 'Demain', exact: true }).click();
  await page.getByRole('heading', { name: 'Une journée toute tranquille' }).waitFor();
  await page.getByText('Autre jour', { exact: true }).click();
  const future = new Date(); future.setDate(future.getDate() + 5);
  const futureKey = `${future.getFullYear()}-${String(future.getMonth()+1).padStart(2,'0')}-${String(future.getDate()).padStart(2,'0')}`;
  await page.getByLabel('Choisir une date').fill(futureKey);
  await page.getByRole('button', { name: 'Revenir à aujourd’hui', exact: true }).click();
  await page.getByRole('heading', { name: 'Je range mon livre', exact: true }).waitFor();
  assert.deepEqual(errors, []);
  console.log('PASS: desktop/mobile, speech output, voice navigation, live camera, rejected/accepted photos, sequential unlocking, persistence, adult creation, focused layout, saved large-text/overview preferences, optional example and date navigation; no browser errors.');
} finally { await browser.close(); }
