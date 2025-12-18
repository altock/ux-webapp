# UX Skill for Claude

Professional UX tooling for Claude Code. A knowledge-based skill that gives Claude structured UX workflows, reference materials, and templates.

## Structure

```
skills/
└── ux-webapp/
    ├── SKILL.md                # Main skill definition
    ├── reference/
    │   ├── HEURISTICS.md       # Nielsen's heuristics + severity scale
    │   └── CHECKLISTS.md       # Forms, a11y, navigation, responsive
    └── templates/
        ├── UX_AUDIT.md         # Audit output template
        ├── DESIGN_SPEC.md      # Implementation spec template
        └── USABILITY_TEST.md   # User testing plan template
```

## Installation

### Via Plugin Marketplace

```
/plugin marketplace add altock/ux-webapp
/plugin install ux-webapp
```

### Manual Installation

Copy the `skills/ux-webapp/` directory to your project's `.claude/skills/` folder:

```bash
cp -r skills/ux-webapp/ /path/to/project/.claude/skills/ux-webapp/
```

## What It Does

- UX audits with Nielsen heuristics
- Design specs with acceptance criteria
- Accessibility reviews (WCAG 2.2 AA)
- User flow design and wireframes
- Usability test planning
- Microcopy improvements

See [`skills/ux-webapp/README.md`](skills/ux-webapp/README.md) for full documentation.

## License

MIT
