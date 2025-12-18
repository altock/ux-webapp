import { createDom } from './dom.js';

function collapseWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function stripNonContent(text) {
  return text
    .replace(/\u00a0/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text) {
  const normalized = text
    .replace(/([.!?])\s+(?=[A-Z0-9])/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(Boolean);
  return normalized.length ? normalized : text ? [text] : [];
}

function tokenizeWords(text) {
  const matches = text.toLowerCase().match(/[a-z0-9]+(?:'[a-z0-9]+)?/g);
  return matches ?? [];
}

function countSyllablesInWord(rawWord) {
  const word = rawWord
    .toLowerCase()
    .replace(/[^a-z]/g, '');

  if (!word) return 0;
  if (word.length <= 3) return 1;

  const vowels = 'aeiouy';
  let count = 0;
  let prevIsVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevIsVowel) count++;
    prevIsVowel = isVowel;
  }

  // Drop silent "e"
  if (word.endsWith('e')) {
    if (!word.endsWith('le') || vowels.includes(word[word.length - 3])) {
      count--;
    }
  }

  // Add "le" ending (table, candle) when consonant + le.
  if (word.endsWith('le') && word.length > 2) {
    const thirdFromEnd = word[word.length - 3];
    if (!vowels.includes(thirdFromEnd)) count++;
  }

  return Math.max(1, count);
}

function safeDiv(n, d) {
  return d === 0 ? 0 : n / d;
}

export function computeReadability(text) {
  const cleaned = stripNonContent(text);
  const sentences = splitSentences(cleaned);
  const words = tokenizeWords(cleaned);
  const syllables = words.reduce((sum, w) => sum + countSyllablesInWord(w), 0);

  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = words.length;
  const syllableCount = syllables;

  const wordsPerSentence = safeDiv(wordCount, sentenceCount);
  const syllablesPerWord = safeDiv(syllableCount, Math.max(1, wordCount));

  const fleschReadingEase =
    206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;

  const fleschKincaidGrade =
    0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;

  return {
    counts: {
      characters: cleaned.length,
      words: wordCount,
      sentences: sentences.length,
      syllables: syllableCount
    },
    averages: {
      wordsPerSentence: Number(wordsPerSentence.toFixed(2)),
      syllablesPerWord: Number(syllablesPerWord.toFixed(2))
    },
    scores: {
      fleschReadingEase: Number(fleschReadingEase.toFixed(1)),
      fleschKincaidGrade: Number(fleschKincaidGrade.toFixed(1))
    }
  };
}

function findLongSentences(sentences, { maxWords = 22, limit = 5 } = {}) {
  const results = [];
  for (const sentence of sentences) {
    const words = tokenizeWords(sentence);
    if (words.length > maxWords) {
      results.push({
        words: words.length,
        sentence: sentence.length > 240 ? `${sentence.slice(0, 237)}…` : sentence
      });
    }
    if (results.length >= limit) break;
  }
  return results;
}

export function lintReadabilityFromText(text, { longSentenceMaxWords = 22 } = {}) {
  const cleaned = stripNonContent(text);
  const sentences = splitSentences(cleaned);
  const metrics = computeReadability(cleaned);

  const findings = [];
  if (metrics.counts.words < 30) {
    findings.push({
      severity: 'info',
      type: 'small-sample',
      message: 'Text sample is short; readability scores may be noisy.'
    });
  }
  if (metrics.averages.wordsPerSentence > longSentenceMaxWords) {
    findings.push({
      severity: 'medium',
      type: 'long-sentences',
      message: `Average sentence length is ${metrics.averages.wordsPerSentence} words; consider breaking up long sentences.`
    });
  }
  if (metrics.scores.fleschReadingEase < 50) {
    findings.push({
      severity: 'low',
      type: 'hard-to-read',
      message: `Flesch Reading Ease is ${metrics.scores.fleschReadingEase}; consider simpler wording for broad audiences.`
    });
  }

  const longSentences = findLongSentences(sentences, {
    maxWords: longSentenceMaxWords,
    limit: 5
  });

  return {
    metrics,
    findings,
    longSentences
  };
}

export function extractTextFromHtml(html, { baseUrl, maxChars = 50_000 } = {}) {
  const { dom, document } = createDom(html, { baseUrl });

  for (const el of document.querySelectorAll('script,style,noscript,template')) {
    el.remove();
  }

  const raw = collapseWhitespace(document.body?.textContent ?? '');
  const limited = raw.length > maxChars ? `${raw.slice(0, maxChars)}…` : raw;

  // Help GC: release window.
  dom.window.close?.();

  return limited;
}

