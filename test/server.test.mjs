import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { test, after } from 'node:test';

const port = 3100;
const server = spawn(process.execPath, ['server.mjs'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, PORT: String(port) },
  stdio: 'ignore'
});

async function request(path, options) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      return await fetch(`http://127.0.0.1:${port}${path}`, options);
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
  throw new Error('Sandbox server did not start');
}

after(() => server.kill());

test('solver preview excludes Tier C from guaranteed price', async () => {
  const response = await request('/api/solver/preview', { method: 'POST' });
  const preview = await response.json();
  assert.equal(response.status, 200);
  assert.equal(preview.grossMinor, 7200);
  assert.equal(preview.guaranteedMinor, 600);
  assert.equal(preview.possibleMinor, 300);
  assert.equal(preview.netMinor, 6600);
  assert.equal(preview.selectedRail.id, 'aani');
});

test('STOP revokes an approval session without settlement', async () => {
  await request('/api/solver/preview', { method: 'POST' });
  const response = await request('/api/checkout/stop', { method: 'POST' });
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.status, 'STOPPED');
  const approval = await request('/api/checkout/approve', { method: 'POST' });
  assert.equal(approval.status, 409);
});

test('reconciliation returns line-item confidence and categories', async () => {
  const response = await request('/api/reconcile', { method: 'POST' });
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.status, 'MATCHED');
  assert.equal(result.confidence, 0.98);
  assert.equal(result.categories.length, 3);
});
