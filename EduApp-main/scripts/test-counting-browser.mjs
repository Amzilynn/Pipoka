import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { freshCountingProgress } from '../src/bublii/utils/countingProgress.js';
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const url = (process.env.COUNTING_TEST_URL || 'http://127.0.0.1:5182') + '/enfant/activite?module=learn&activity=compter-des-objets';
const key = 'bublii:learning:v1:local-child:compter-des-objets';
const choices = () => page.locator('button.card-choice');
const objects = () => page.locator('button[aria-pressed]');
const saved = () => page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
async function answer(correct = true) {
  const target = await objects().count();
  const button = correct ? page.getByRole('button', { name: String(target), exact: true }) : choices().filter({ hasNotText: new RegExp('^' + target + '$') }).first();
  await button.click();
}
try {
  await page.addInitScript(() => {
    sessionStorage.setItem('bubliiRole', 'enfant');
    window.speechSynthesis.speak = utterance => utterance.onend?.();
    window.speechSynthesis.cancel = () => {};
  });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await choices().first().waitFor();
  assert.equal(await choices().count(), 2);
  assert.ok(await objects().count() <= 3);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  for (let session = 0; session < 2; session++) {
    if (session) await page.reload({ waitUntil: 'domcontentloaded' });
    for (let round = 0; round < 3; round++) {
      await choices().first().waitFor();
      await answer();
      if (round < 2) await choices().first().waitFor({ state: 'visible' });
      if (round < 2) await page.waitForFunction(() => [...document.querySelectorAll('button.card-choice')].every(b => !b.disabled));
    }
    await page.getByRole('heading', { name: 'Bravo champion !' }).waitFor();
  }
  assert.equal((await saved()).level, 2);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await choices().first().waitFor();
  assert.equal(await choices().count(), 3);
  const initialChoices = await choices().allTextContents();
  await answer(false);
  await page.waitForFunction(() => [...document.querySelectorAll('button.card-choice')].every(b => !b.disabled));
  await answer(false);
  await page.getByText('Compte les objets :', { exact: false }).waitFor();
  assert.deepEqual(await choices().allTextContents(), initialChoices);
  assert.equal((await saved()).level, 1);
  await page.waitForFunction(() => [...document.querySelectorAll('button.card-choice')].every(b => !b.disabled));
  await answer();
  assert.equal((await saved()).attempts.at(-1).helpUsed, true);
  assert.equal((await saved()).attempts.at(-1).hadError, true);
  await page.waitForFunction(() => document.querySelectorAll('button.card-choice').length === 2);
  assert.ok(await objects().count() <= 3);
  await page.getByRole('button', { name: 'Montre-moi comment compter' }).click();
  await answer();
  assert.equal((await saved()).attempts.at(-1).helpUsed, true);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await choices().first().waitFor();
  assert.equal(await choices().count(), 2);
  // Stored maximum difficulty really renders four choices and up to ten objects.
  await page.evaluate(({ key, progress }) => localStorage.setItem(key, JSON.stringify(progress)), { key, progress: { ...freshCountingProgress(), level: 3 } });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await choices().first().waitFor();
  assert.equal(await choices().count(), 4);
  assert.ok(await objects().count() <= 10);
  // Storage restrictions must not prevent play.
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
  await answer();
  await page.getByText('La sauvegarde est indisponible', { exact: false }).waitFor();
  assert.deepEqual(errors, []);
  console.log('Counting browser checks passed: progression across visits, retry/example, stable choices, persistence, mobile width, maximum level, unavailable storage.');
} finally {
  await browser.close();
}
