import test from 'node:test';
import assert from 'node:assert/strict';

import { computeReadability, lintReadabilityFromText } from '../src/lib/readability.js';

test('computeReadability counts words and sentences', () => {
  const text = 'The cat sat on the mat. The dog barked.';
  const out = computeReadability(text);

  assert.equal(out.counts.sentences, 2);
  assert.equal(out.counts.words, 9);
  assert.ok(Number.isFinite(out.scores.fleschReadingEase));
  assert.ok(Number.isFinite(out.scores.fleschKincaidGrade));
});

test('lintReadabilityFromText flags long sentences', () => {
  const text =
    'This is a deliberately long sentence with many words that should trigger the long sentence detection threshold for readability linting.';
  const out = lintReadabilityFromText(text, { longSentenceMaxWords: 10 });
  assert.ok(out.findings.some(f => f.type === 'long-sentences'));
  assert.ok(out.longSentences.length >= 1);
});

