const GENERIC_LINK_TEXT = new Set([
  'click here',
  'learn more',
  'more',
  'here',
  'read more'
]);

function collapseWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function elText(el) {
  return collapseWhitespace(el.textContent ?? '');
}

function getLabelTextForControl(document, control) {
  const ariaLabel = control.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) return collapseWhitespace(ariaLabel);

  const labelledBy = control.getAttribute('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy
      .split(/\s+/g)
      .map(s => s.trim())
      .filter(Boolean);
    const parts = ids
      .map(id => document.getElementById(id))
      .filter(Boolean)
      .map(el => elText(el));
    const joined = collapseWhitespace(parts.join(' '));
    if (joined) return joined;
  }

  const id = control.getAttribute('id');
  if (id) {
    const label = [...document.querySelectorAll('label')].find(
      l => (l.getAttribute('for') ?? '').trim() === id
    );
    if (label) {
      const txt = elText(label);
      if (txt) return txt;
    }
  }

  const wrappingLabel = control.closest?.('label');
  if (wrappingLabel) {
    const clone = wrappingLabel.cloneNode(true);
    if (clone.querySelectorAll) {
      for (const child of clone.querySelectorAll('input,select,textarea,button')) {
        child.remove();
      }
    }
    const txt = elText(clone);
    if (txt) return txt;
  }

  const placeholder = control.getAttribute('placeholder');
  if (placeholder && placeholder.trim()) return `(placeholder) ${collapseWhitespace(placeholder)}`;

  return '';
}

function getAccessibleNameApprox(document, el) {
  const ariaLabel = el.getAttribute?.('aria-label');
  if (ariaLabel && ariaLabel.trim()) return collapseWhitespace(ariaLabel);

  const labelledBy = el.getAttribute?.('aria-labelledby');
  if (labelledBy) {
    const ids = labelledBy
      .split(/\s+/g)
      .map(s => s.trim())
      .filter(Boolean);
    const parts = ids
      .map(id => document.getElementById(id))
      .filter(Boolean)
      .map(node => elText(node));
    const joined = collapseWhitespace(parts.join(' '));
    if (joined) return joined;
  }

  const tag = el.tagName?.toLowerCase?.() ?? '';
  if (tag === 'input') {
    const type = (el.getAttribute('type') ?? '').toLowerCase();
    if (['submit', 'button', 'reset'].includes(type)) {
      const value = el.getAttribute('value');
      if (value && value.trim()) return collapseWhitespace(value);
    }
    return getLabelTextForControl(document, el);
  }

  if (tag === 'img') {
    const alt = el.getAttribute('alt');
    if (alt && alt.trim()) return collapseWhitespace(alt);
  }

  const txt = elText(el);
  if (txt) return txt;
  return '';
}

function elementSelector(el) {
  try {
    if (!el || !el.tagName) return '';
    const tag = el.tagName.toLowerCase();
    const id = el.getAttribute?.('id');
    const className = el.getAttribute?.('class');
    const parts = [tag];
    if (id) parts.push(`#${id}`);
    if (className) {
      const first = className
        .split(/\s+/g)
        .map(s => s.trim())
        .filter(Boolean)[0];
      if (first) parts.push(`.${first}`);
    }
    return parts.join('');
  } catch {
    return '';
  }
}

export function extractUiInventory(document, { maxElementsPerCategory = 60 } = {}) {
  const pageTitle = collapseWhitespace(document.title ?? '');
  const metaDescription = collapseWhitespace(
    document.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
  );
  const lang = (document.documentElement?.getAttribute('lang') ?? '').trim();

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .slice(0, maxElementsPerCategory)
    .map(h => ({
      level: Number.parseInt(h.tagName.substring(1), 10),
      text: elText(h)
    }));

  const links = [...document.querySelectorAll('a[href]')]
    .slice(0, maxElementsPerCategory)
    .map(a => ({
      text: getAccessibleNameApprox(document, a),
      href: a.getAttribute('href') ?? '',
      selector: elementSelector(a)
    }));

  const buttons = [
    ...document.querySelectorAll(
      'button, input[type="button"], input[type="submit"], input[type="reset"], [role="button"]'
    )
  ]
    .slice(0, maxElementsPerCategory)
    .map(btn => ({
      text: getAccessibleNameApprox(document, btn),
      selector: elementSelector(btn)
    }));

  const images = [...document.querySelectorAll('img')]
    .slice(0, maxElementsPerCategory)
    .map(img => ({
      alt: (img.getAttribute('alt') ?? '').trim(),
      src: (img.getAttribute('src') ?? '').trim(),
      selector: elementSelector(img)
    }));

  const forms = [...document.querySelectorAll('form')]
    .slice(0, Math.max(10, Math.floor(maxElementsPerCategory / 3)))
    .map(form => {
      const inputs = [...form.querySelectorAll('input, select, textarea')]
        .filter(control => {
          const tag = control.tagName.toLowerCase();
          if (tag !== 'input') return true;
          const type = (control.getAttribute('type') ?? '').toLowerCase();
          return !['submit', 'button', 'reset', 'image'].includes(type);
        })
        .slice(0, maxElementsPerCategory);

      return {
        selector: elementSelector(form),
        fields: inputs.map(control => ({
          tag: control.tagName.toLowerCase(),
          type: (control.getAttribute('type') ?? '').toLowerCase(),
          name: (control.getAttribute('name') ?? '').trim(),
          id: (control.getAttribute('id') ?? '').trim(),
          required: control.hasAttribute('required'),
          autocomplete: (control.getAttribute('autocomplete') ?? '').trim(),
          label: getLabelTextForControl(document, control),
          selector: elementSelector(control)
        }))
      };
    });

  const landmarks = {
    header: !!document.querySelector('header'),
    nav: !!document.querySelector('nav'),
    main: !!document.querySelector('main'),
    footer: !!document.querySelector('footer'),
    aside: !!document.querySelector('aside')
  };

  const issues = [];

  if (!pageTitle) {
    issues.push({
      severity: 'high',
      type: 'missing-title',
      message: 'Missing or empty <title> (hurts wayfinding, tabs, history, search).'
    });
  }

  if (!lang) {
    issues.push({
      severity: 'high',
      type: 'missing-lang',
      message: 'Missing <html lang="…"> (hurts screen reader pronunciation and some translation tools).'
    });
  }

  const h1Count = [...document.querySelectorAll('h1')].length;
  if (h1Count === 0) {
    issues.push({
      severity: 'medium',
      type: 'missing-h1',
      message: 'No <h1> found (hurts page hierarchy and scanning).'
    });
  } else if (h1Count > 1) {
    issues.push({
      severity: 'low',
      type: 'multiple-h1',
      message: `Multiple <h1> found (${h1Count}). Consider a single primary page heading.`
    });
  }

  const unlabeledButtons = buttons.filter(b => !b.text);
  if (unlabeledButtons.length) {
    issues.push({
      severity: 'high',
      type: 'unlabeled-buttons',
      message: `${unlabeledButtons.length} button(s) appear to have no accessible name (empty text/aria-label).`
    });
  }

  const genericLinks = links
    .filter(l => l.text)
    .filter(l => GENERIC_LINK_TEXT.has(l.text.toLowerCase()));
  if (genericLinks.length) {
    issues.push({
      severity: 'medium',
      type: 'generic-link-text',
      message: `${genericLinks.length} link(s) have generic text like “${genericLinks[0].text}”. Prefer descriptive, task-oriented link text.`
    });
  }

  const unlabeledFields = forms
    .flatMap(f => f.fields)
    .filter(field => {
      const isHidden = field.type === 'hidden';
      return !isHidden && !field.label;
    });
  if (unlabeledFields.length) {
    issues.push({
      severity: 'high',
      type: 'unlabeled-form-fields',
      message: `${unlabeledFields.length} form field(s) appear unlabeled (no <label>, aria-label, or aria-labelledby).`
    });
  }

  return {
    page: { title: pageTitle, metaDescription, lang: lang || null },
    landmarks,
    counts: {
      headings: headings.length,
      links: links.length,
      buttons: buttons.length,
      images: images.length,
      forms: forms.length
    },
    headings,
    links,
    buttons,
    images,
    forms,
    issues
  };
}
