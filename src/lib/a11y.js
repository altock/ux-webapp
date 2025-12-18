import axe from 'axe-core';
import { createDom } from './dom.js';

function normalizeAxeNode(node) {
  return {
    html: node.html,
    target: node.target,
    failureSummary: node.failureSummary ?? null
  };
}

function normalizeViolation(violation, { maxNodesPerViolation }) {
  return {
    id: violation.id,
    impact: violation.impact ?? null,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    tags: violation.tags,
    nodes: (violation.nodes ?? []).slice(0, maxNodesPerViolation).map(normalizeAxeNode)
  };
}

export async function runAxeAudit(html, { baseUrl, maxViolations = 25, maxNodesPerViolation = 3 } = {}) {
  const { dom, document } = createDom(html, { baseUrl });

  // Inject axe into the JSDOM window context (without running page scripts).
  dom.window.eval(axe.source);

  const results = await dom.window.axe.run(document, {
    // JSDOM can't compute colors reliably; avoid confusing output.
    rules: {
      'color-contrast': { enabled: false }
    },
    resultTypes: ['violations'],
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
    }
  });

  const violations = (results.violations ?? [])
    .slice(0, maxViolations)
    .map(v => normalizeViolation(v, { maxNodesPerViolation }));

  const byImpact = violations.reduce(
    (acc, v) => {
      const key = v.impact ?? 'unknown';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    /** @type {Record<string, number>} */ ({})
  );

  return {
    summary: {
      violations: violations.length,
      byImpact
    },
    violations
  };
}

