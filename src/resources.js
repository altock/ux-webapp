export const RESOURCES = [
  {
    name: 'nielsen-heuristics',
    uri: 'ux://framework/nielsen-heuristics',
    title: "Nielsen's 10 Usability Heuristics",
    description: 'A compact reference for heuristic evaluations.',
    mimeType: 'text/markdown',
    text: [
      '# Nielsen’s 10 usability heuristics (reference)',
      '',
      '1. Visibility of system status',
      '2. Match between system and the real world',
      '3. User control and freedom',
      '4. Consistency and standards',
      '5. Error prevention',
      '6. Recognition rather than recall',
      '7. Flexibility and efficiency of use',
      '8. Aesthetic and minimalist design',
      '9. Help users recognize, diagnose, and recover from errors',
      '10. Help and documentation',
      '',
      'Suggested severity scale (0–4): 0 none, 1 cosmetic, 2 minor, 3 major, 4 critical.'
    ].join('\n')
  },
  {
    name: 'pour-wcag',
    uri: 'ux://framework/pour-wcag',
    title: 'Accessibility: POUR + quick checks',
    description: 'High-level accessibility framing plus practical web checks.',
    mimeType: 'text/markdown',
    text: [
      '# Accessibility framing: POUR',
      '',
      '- **Perceivable**: text alternatives, captions, adaptable structure, distinguishable content.',
      '- **Operable**: keyboard access, enough time, avoid seizures, clear navigation.',
      '- **Understandable**: readable text, predictable UI, helpful error handling.',
      '- **Robust**: semantic HTML, ARIA used correctly, compatible with assistive tech.',
      '',
      'Quick checks:',
      '- Can you tab through everything in a logical order?',
      '- Do form fields have explicit labels and clear error messages?',
      '- Is there a visible focus style?',
      '- Are headings hierarchical and meaningful?',
      '- Are buttons/links uniquely descriptive out of context?'
    ].join('\n')
  },
  {
    name: 'forms-checklist',
    uri: 'ux://checklist/forms',
    title: 'Forms UX checklist',
    description: 'A practical checklist for web form usability.',
    mimeType: 'text/markdown',
    text: [
      '# Forms UX checklist',
      '',
      '- Use explicit labels (don’t rely on placeholder-only labels).',
      '- Group related fields; keep forms as short as possible.',
      '- Mark required vs optional clearly (prefer “optional” labels).',
      '- Use input types (`email`, `tel`, `password`) and `autocomplete` tokens.',
      '- Validate inline when helpful; preserve user input on errors.',
      '- Write errors that explain: what happened, why, and how to fix.',
      '- Disable submit only with a clear reason; never trap the user.',
      '- Provide sensible defaults; avoid forcing resets.',
      '- Confirm destructive actions; allow undo where possible.'
    ].join('\n')
  },
  {
    name: 'usability-test-template',
    uri: 'ux://template/usability-test',
    title: 'Usability test script template',
    description: 'A fill-in template for moderated usability tests.',
    mimeType: 'text/markdown',
    text: [
      '# Usability test script (template)',
      '',
      '## Goal',
      '- What do we need to learn? What decision will this inform?',
      '',
      '## Participants',
      '- Target profile, recruiting criteria, and sample size.',
      '',
      '## Setup',
      '- Device/browser, accounts, test data, recording, consent.',
      '',
      '## Tasks',
      '1. Task 1: …',
      '   - Success criteria:',
      '   - Follow-up questions:',
      '2. Task 2: …',
      '',
      '## Metrics',
      '- Task success, time on task, errors, confidence rating, SUS (optional).',
      '',
      '## Debrief',
      '- What felt easy/hard? What would you change?',
      '',
      '## Notes for facilitator',
      '- Encourage think-aloud, avoid leading, probe for expectations.'
    ].join('\n')
  }
];

