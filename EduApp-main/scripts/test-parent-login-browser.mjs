import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

// Mock API responses so this regression never creates accounts or changes records.
const base = 'http://127.0.0.1:5187';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5187', '--strictPort'], {
  env: { ...process.env, AUTH_DATABASE_PATH: ':memory:' }, windowsHide: true, stdio: 'pipe',
});
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
server.stderr.on('data', chunk => { output += chunk; });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(output);
    if (output.includes(base)) { ready = true; break; }
    await delay(100);
  }
  assert.ok(ready, `Vite did not start: ${output}`);
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  const user = { id: 'parent-regression', role: 'parent', name: 'Test Parent', email: 'parent@example.test' };
  let loginRequests = 0;
  await page.route('**/api/auth/**', async route => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/login')) {
      loginRequests++;
      const input = route.request().postDataJSON();
      if (input.password !== 'correct-password') return route.fulfill({ status: 401, json: { error: 'Mot de passe incorrect.' } });
    }
    return route.fulfill({ json: { user } });
  });
  await page.route('**/api/children**', route => route.fulfill({ json: { children: [] } }));
  await page.goto(`${base}/connexion/parent`);
  await page.locator('#auth-password').waitFor();
  await delay(300);
  assert.equal(new URL(page.url()).pathname, '/connexion/parent', 'restored session must not skip the form');
  await page.locator('#auth-email').fill(user.email);
  await page.locator('#auth-password').fill('wrong-password');
  await page.getByRole('button', { name: 'Me connecter', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Mot de passe incorrect.' }).waitFor();
  assert.equal(new URL(page.url()).pathname, '/connexion/parent');
  await page.locator('#auth-password').fill('correct-password');
  await page.getByRole('button', { name: 'Me connecter', exact: true }).click();
  await page.waitForURL(`${base}/parent`);
  assert.equal(loginRequests, 2, 'entry must submit credentials to the server');
  await page.reload();
  await page.waitForURL(`${base}/connexion/parent`);
  await page.locator('#auth-password').waitFor();
  await page.locator('#auth-email').fill(user.email);
  await page.locator('#auth-password').fill('correct-password');
  await page.getByRole('button', { name: 'Me connecter', exact: true }).click();
  await page.waitForURL(`${base}/parent`);
  await page.getByRole('link', { name: 'Boblii, accueil', exact: true }).click();
  await page.waitForURL(`${base}/`);
  await page.getByRole('link', { name: /Se connecter/ }).first().click();
  await page.locator('a[href="/connexion/parent"]').click();
  await page.locator('#auth-password').waitFor();
  assert.equal(new URL(page.url()).pathname, '/connexion/parent', 'returning from home must ask again');
  console.log('PASS: restored session, invalid credentials, successful login, reload, and re-entry checks');
} finally {
  await browser?.close();
  server.kill();
}
