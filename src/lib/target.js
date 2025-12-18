import fs from 'node:fs/promises';
import path from 'node:path';

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n');
}

async function readFileTextWithLimit(filePath, { maxBytes }) {
  const resolvedPath = path.resolve(filePath);
  const buffer = await fs.readFile(resolvedPath);
  if (buffer.byteLength > maxBytes) {
    throw new Error(
      `File is too large (${buffer.byteLength} bytes). Max allowed is ${maxBytes} bytes.`
    );
  }
  return { text: normalizeNewlines(buffer.toString('utf8')), resolvedPath };
}

async function fetchTextWithLimit(url, { maxBytes, timeoutMs }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'ux-mcp-skill/0.1.0 (+mcp)'
      }
    });
    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    }

    const reader = res.body?.getReader();
    if (!reader) {
      const text = await res.text();
      const bytes = Buffer.byteLength(text, 'utf8');
      if (bytes > maxBytes) {
        throw new Error(
          `Response is too large (${bytes} bytes). Max allowed is ${maxBytes} bytes.`
        );
      }
      return { text: normalizeNewlines(text), finalUrl: res.url };
    }

    const chunks = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        try {
          await reader.cancel();
        } catch {
          // ignore
        }
        throw new Error(
          `Response is too large (> ${maxBytes} bytes). Increase maxBytes if needed.`
        );
      }
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks.map(chunk => Buffer.from(chunk)));
    return { text: normalizeNewlines(buffer.toString('utf8')), finalUrl: res.url };
  } finally {
    clearTimeout(timeout);
  }
}

export async function loadHtmlTarget(target, options = {}) {
  const {
    maxBytes = 2_000_000,
    timeoutMs = 15_000
  } = options;

  if (target.type === 'html') {
    return {
      html: normalizeNewlines(target.html),
      baseUrl: target.baseUrl,
      source: { type: 'html' }
    };
  }

  if (target.type === 'file') {
    const { text, resolvedPath } = await readFileTextWithLimit(target.path, {
      maxBytes
    });
    return {
      html: text,
      baseUrl: undefined,
      source: { type: 'file', path: resolvedPath }
    };
  }

  if (target.type === 'url') {
    const { text, finalUrl } = await fetchTextWithLimit(target.url, {
      maxBytes,
      timeoutMs
    });
    return {
      html: text,
      baseUrl: finalUrl,
      source: { type: 'url', url: finalUrl }
    };
  }

  // This should be unreachable if schemas are respected.
  throw new Error(`Unknown target type: ${target?.type}`);
}

