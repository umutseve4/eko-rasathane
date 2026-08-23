import test from 'node:test';
import assert from 'node:assert/strict';
import { interpretCoefficient, nextRecallDate, progressPercent, minutesToClock } from '../core.mjs';

test('coefficient interpreter preserves direction and units', () => {
  const text = interpretCoefficient({ beta: -2.5, xUnit: 'puan', yUnit: 'TL' });
  assert.match(text, /2,5 TL azalış/);
  assert.match(text, /nedensellik değil/);
});

test('recall date uses deterministic spacing', () => {
  assert.equal(nextRecallDate('good', new Date('2026-08-23T00:00:00Z')), '2026-08-30');
});

test('progress is clamped', () => {
  assert.equal(progressPercent(12, 10), 100);
  assert.equal(progressPercent(-2, 10), 0);
});

test('clock is zero padded', () => assert.equal(minutesToClock(65), '01:05'));
