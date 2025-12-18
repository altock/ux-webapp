#!/usr/bin/env node
import process from 'node:process';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod/v4';

import { TargetSchema, SourceSchema, CommonOptionsSchema } from './lib/schemas.js';
import { loadHtmlTarget } from './lib/target.js';
import { createDom } from './lib/dom.js';
import { extractUiInventory } from './lib/inventory.js';
import { runAxeAudit } from './lib/a11y.js';
import {
  extractTextFromHtml,
  lintReadabilityFromText
} from './lib/readability.js';
import {
  renderA11yMarkdown,
  renderInventoryMarkdown,
  renderReadabilityMarkdown
} from './lib/render.js';
import { RESOURCES } from './resources.js';
import { PROMPTS } from './prompts.js';

const server = new McpServer({
  name: 'ux-mcp-skill',
  version: '0.1.0'
});

server.registerTool(
  'ux_extract_ui_inventory',
  {
    title: 'Extract UI Inventory',
    description:
      'Parse HTML (from URL, file, or raw) and return a structured inventory of headings, links, buttons, forms, images, and quick UX issues.',
    inputSchema: {
      target: TargetSchema,
      options: z
        .object({
          maxElementsPerCategory: z.number().int().min(10).max(500).optional()
        })
        .optional(),
      fetchOptions: CommonOptionsSchema
    },
    outputSchema: {
      source: SourceSchema,
      page: z.object({
        title: z.string(),
        metaDescription: z.string(),
        lang: z.string().nullable()
      }),
      landmarks: z.record(z.boolean()),
      counts: z.record(z.number()),
      headings: z.array(z.object({ level: z.number(), text: z.string() })),
      links: z.array(z.object({ text: z.string(), href: z.string(), selector: z.string() })),
      buttons: z.array(z.object({ text: z.string(), selector: z.string() })),
      images: z.array(z.object({ alt: z.string(), src: z.string(), selector: z.string() })),
      forms: z.array(
        z.object({
          selector: z.string(),
          fields: z.array(
            z.object({
              tag: z.string(),
              type: z.string(),
              name: z.string(),
              id: z.string(),
              required: z.boolean(),
              autocomplete: z.string(),
              label: z.string(),
              selector: z.string()
            })
          )
        })
      ),
      issues: z.array(
        z.object({
          severity: z.string(),
          type: z.string(),
          message: z.string()
        })
      )
    }
  },
  async ({ target, options, fetchOptions }) => {
    const loaded = await loadHtmlTarget(target, fetchOptions ?? {});
    const { document } = createDom(loaded.html, { baseUrl: loaded.baseUrl });

    const inventory = extractUiInventory(document, options ?? {});
    const sourceLabel =
      loaded.source.type === 'url'
        ? loaded.source.url
        : loaded.source.type === 'file'
          ? loaded.source.path
          : 'inline HTML';

    const markdown = renderInventoryMarkdown(inventory, { sourceLabel });

    return {
      content: [{ type: 'text', text: markdown }],
      structuredContent: { source: loaded.source, ...inventory }
    };
  }
);

server.registerTool(
  'ux_accessibility_axe_audit',
  {
    title: 'Accessibility Audit (axe-core)',
    description:
      'Run a static axe-core audit (in JSDOM) on HTML from URL, file, or raw. Good for quick checks; verify in a real browser for full coverage.',
    inputSchema: {
      target: TargetSchema,
      options: z
        .object({
          maxViolations: z.number().int().min(1).max(200).optional(),
          maxNodesPerViolation: z.number().int().min(1).max(20).optional()
        })
        .optional(),
      fetchOptions: CommonOptionsSchema
    },
    outputSchema: {
      source: SourceSchema,
      summary: z.object({
        violations: z.number(),
        byImpact: z.record(z.number())
      }),
      violations: z.array(
        z.object({
          id: z.string(),
          impact: z.string().nullable(),
          description: z.string(),
          help: z.string(),
          helpUrl: z.string(),
          tags: z.array(z.string()),
          nodes: z.array(
            z.object({
              html: z.string(),
              target: z.array(z.string()),
              failureSummary: z.string().nullable()
            })
          )
        })
      )
    }
  },
  async ({ target, options, fetchOptions }) => {
    const loaded = await loadHtmlTarget(target, fetchOptions ?? {});

    const audit = await runAxeAudit(loaded.html, {
      baseUrl: loaded.baseUrl,
      ...(options ?? {})
    });

    const sourceLabel =
      loaded.source.type === 'url'
        ? loaded.source.url
        : loaded.source.type === 'file'
          ? loaded.source.path
          : 'inline HTML';

    const markdown = renderA11yMarkdown(audit, { sourceLabel });

    return {
      content: [{ type: 'text', text: markdown }],
      structuredContent: { source: loaded.source, ...audit }
    };
  }
);

server.registerTool(
  'ux_readability_lint',
  {
    title: 'Readability Lint',
    description:
      'Compute readability metrics (Flesch) and flag long sentences. Input can be raw text or HTML/URL/file (text extracted from HTML body).',
    inputSchema: {
      input: z.discriminatedUnion('type', [
        z.object({ type: z.literal('text'), text: z.string().min(1) }),
        z.object({ type: z.literal('target'), target: TargetSchema })
      ]),
      options: z
        .object({
          maxChars: z.number().int().min(100).max(200_000).optional(),
          longSentenceMaxWords: z.number().int().min(10).max(60).optional()
        })
        .optional(),
      fetchOptions: CommonOptionsSchema
    },
    outputSchema: {
      source: SourceSchema,
      metrics: z.object({
        counts: z.object({
          characters: z.number(),
          words: z.number(),
          sentences: z.number(),
          syllables: z.number()
        }),
        averages: z.object({
          wordsPerSentence: z.number(),
          syllablesPerWord: z.number()
        }),
        scores: z.object({
          fleschReadingEase: z.number(),
          fleschKincaidGrade: z.number()
        })
      }),
      findings: z.array(
        z.object({
          severity: z.string(),
          type: z.string(),
          message: z.string()
        })
      ),
      longSentences: z.array(
        z.object({
          words: z.number(),
          sentence: z.string()
        })
      )
    }
  },
  async ({ input, options, fetchOptions }) => {
    const resolvedOptions = options ?? {};
    const maxChars = resolvedOptions.maxChars ?? 50_000;
    const longSentenceMaxWords = resolvedOptions.longSentenceMaxWords ?? 22;

    let source = { type: 'text' };
    let sourceLabel = 'text';
    let text = '';

    if (input.type === 'text') {
      text = input.text;
    } else {
      const loaded = await loadHtmlTarget(input.target, fetchOptions ?? {});
      source = loaded.source;
      sourceLabel =
        loaded.source.type === 'url'
          ? loaded.source.url
          : loaded.source.type === 'file'
            ? loaded.source.path
            : 'inline HTML';
      text = extractTextFromHtml(loaded.html, { baseUrl: loaded.baseUrl, maxChars });
    }

    const lint = lintReadabilityFromText(text, { longSentenceMaxWords });
    const markdown = renderReadabilityMarkdown(lint, { sourceLabel });

    return {
      content: [{ type: 'text', text: markdown }],
      structuredContent: { source, ...lint }
    };
  }
);

for (const resource of RESOURCES) {
  server.registerResource(
    resource.name,
    resource.uri,
    {
      title: resource.title,
      description: resource.description,
      mimeType: resource.mimeType
    },
    async uri => ({
      contents: [{ uri: uri.href, text: resource.text }]
    })
  );
}

for (const prompt of PROMPTS) {
  server.registerPrompt(
    prompt.name,
    {
      title: prompt.title,
      description: prompt.description,
      argsSchema: prompt.argsSchema
    },
    args => prompt.build(args)
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

process.on('SIGINT', async () => {
  try {
    await server.close();
  } catch {
    // ignore
  } finally {
    process.exit(0);
  }
});

process.on('SIGTERM', async () => {
  try {
    await server.close();
  } catch {
    // ignore
  } finally {
    process.exit(0);
  }
});

main().catch(err => {
  process.stderr.write(`ux-mcp-skill failed to start: ${err?.stack ?? err}\n`);
  process.exit(1);
});
