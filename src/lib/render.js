function mdEscape(text) {
  return String(text ?? '').replace(/[\\`*_{}\\[\\]()>#+\\-.!|]/g, '\\\\$&');
}

function bullet(text) {
  return `- ${text}`;
}

export function renderInventoryMarkdown(inventory, { sourceLabel } = {}) {
  const lines = [];
  lines.push(`# UI inventory${sourceLabel ? ` (${sourceLabel})` : ''}`);
  lines.push('');
  lines.push('## Page');
  lines.push(bullet(`Title: ${inventory.page.title ? mdEscape(inventory.page.title) : '_missing_'}`));
  if (inventory.page.metaDescription) {
    lines.push(bullet(`Meta description: ${mdEscape(inventory.page.metaDescription)}`));
  }
  lines.push(bullet(`Lang: ${inventory.page.lang ? mdEscape(inventory.page.lang) : '_missing_'}`));
  lines.push('');
  lines.push('## Landmarks');
  for (const [k, v] of Object.entries(inventory.landmarks)) {
    lines.push(bullet(`${mdEscape(k)}: ${v ? 'yes' : 'no'}`));
  }
  lines.push('');
  lines.push('## Counts');
  for (const [k, v] of Object.entries(inventory.counts)) {
    lines.push(bullet(`${mdEscape(k)}: ${v}`));
  }
  lines.push('');

  if (inventory.issues?.length) {
    lines.push('## Notable issues');
    for (const issue of inventory.issues) {
      lines.push(bullet(`[${issue.severity}] ${mdEscape(issue.message)}`));
    }
    lines.push('');
  }

  if (inventory.headings?.length) {
    lines.push('## Headings (sample)');
    for (const h of inventory.headings.slice(0, 20)) {
      lines.push(bullet(`H${h.level}: ${h.text ? mdEscape(h.text) : '_empty_'}`));
    }
    lines.push('');
  }

  if (inventory.buttons?.length) {
    lines.push('## Buttons (sample)');
    for (const b of inventory.buttons.slice(0, 20)) {
      lines.push(bullet(`${b.text ? mdEscape(b.text) : '_unlabeled_'}${b.selector ? ` (${mdEscape(b.selector)})` : ''}`));
    }
    lines.push('');
  }

  if (inventory.links?.length) {
    lines.push('## Links (sample)');
    for (const l of inventory.links.slice(0, 20)) {
      lines.push(
        bullet(
          `${l.text ? mdEscape(l.text) : '_unlabeled_'} → ${l.href ? mdEscape(l.href) : '_missing href_'}`
        )
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function renderA11yMarkdown(a11y, { sourceLabel } = {}) {
  const lines = [];
  lines.push(`# Accessibility (axe) audit${sourceLabel ? ` (${sourceLabel})` : ''}`);
  lines.push('');
  lines.push('## Summary');
  lines.push(bullet(`Violations: ${a11y.summary.violations}`));
  if (a11y.summary.byImpact) {
    for (const [impact, count] of Object.entries(a11y.summary.byImpact)) {
      lines.push(bullet(`${impact}: ${count}`));
    }
  }
  lines.push('');

  if (!a11y.violations.length) {
    lines.push('_No violations found (note: static JSDOM run; verify in a real browser for full coverage)._');
    return lines.join('\n');
  }

  lines.push('## Top violations');
  for (const v of a11y.violations.slice(0, 10)) {
    lines.push(`### ${mdEscape(v.id)}${v.impact ? ` (${mdEscape(v.impact)})` : ''}`);
    lines.push(bullet(mdEscape(v.help)));
    lines.push(bullet(`Help: ${v.helpUrl}`));
    if (v.nodes?.length) {
      lines.push(bullet('Examples:'));
      for (const n of v.nodes) {
        const target = Array.isArray(n.target) ? n.target.join(', ') : String(n.target ?? '');
        lines.push(bullet(`${mdEscape(target)}${n.failureSummary ? ` — ${mdEscape(n.failureSummary)}` : ''}`));
      }
    }
    lines.push('');
  }

  lines.push('_Note: `color-contrast` is disabled by default because JSDOM can’t reliably compute colors._');
  return lines.join('\n');
}

export function renderReadabilityMarkdown(readability, { sourceLabel } = {}) {
  const lines = [];
  lines.push(`# Readability lint${sourceLabel ? ` (${sourceLabel})` : ''}`);
  lines.push('');
  lines.push('## Metrics');
  lines.push(bullet(`Words: ${readability.metrics.counts.words}`));
  lines.push(bullet(`Sentences: ${readability.metrics.counts.sentences}`));
  lines.push(bullet(`Flesch Reading Ease: ${readability.metrics.scores.fleschReadingEase}`));
  lines.push(bullet(`Flesch-Kincaid Grade: ${readability.metrics.scores.fleschKincaidGrade}`));
  lines.push(bullet(`Avg words/sentence: ${readability.metrics.averages.wordsPerSentence}`));
  lines.push('');

  if (readability.findings?.length) {
    lines.push('## Findings');
    for (const f of readability.findings) {
      lines.push(bullet(`[${f.severity}] ${mdEscape(f.message)}`));
    }
    lines.push('');
  }

  if (readability.longSentences?.length) {
    lines.push('## Long sentences (examples)');
    for (const s of readability.longSentences) {
      lines.push(bullet(`${s.words} words: ${mdEscape(s.sentence)}`));
    }
    lines.push('');
  }

  return lines.join('\n');
}

