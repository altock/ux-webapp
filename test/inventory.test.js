import test from 'node:test';
import assert from 'node:assert/strict';

import { createDom } from '../src/lib/dom.js';
import { extractUiInventory } from '../src/lib/inventory.js';

test('extractUiInventory finds headings, buttons, forms, and issues', () => {
  const html = `<!doctype html>
  <html lang="en">
    <head>
      <title>Login</title>
      <meta name="description" content="Log in to the app">
    </head>
    <body>
      <main>
        <h1>Log in</h1>
        <form>
          <label for="email">Email</label>
          <input id="email" name="email" type="email" required />
          <input type="submit" value="Sign in" />
        </form>
        <a href="/help">Learn more</a>
      </main>
    </body>
  </html>`;

  const { document } = createDom(html, { baseUrl: 'https://example.com/login' });
  const inv = extractUiInventory(document, { maxElementsPerCategory: 50 });

  assert.equal(inv.page.title, 'Login');
  assert.equal(inv.page.lang, 'en');
  assert.equal(inv.headings[0].text, 'Log in');
  assert.ok(inv.buttons.some(b => b.text === 'Sign in'));
  assert.ok(inv.forms[0].fields.some(f => f.name === 'email' && f.label === 'Email'));
  assert.ok(inv.issues.some(i => i.type === 'generic-link-text'));
});

