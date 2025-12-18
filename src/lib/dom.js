import { JSDOM } from 'jsdom';

export function createDom(html, { baseUrl } = {}) {
  const dom = new JSDOM(html, {
    url: baseUrl ?? 'https://example.invalid/',
    pretendToBeVisual: true,
    runScripts: 'outside-only'
  });
  return { dom, document: dom.window.document };
}

