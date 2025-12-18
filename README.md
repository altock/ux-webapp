# UX Skill for Claude

Professional UX tooling for Claude. Two implementations available:

## 1. Claude Skill Plugin (`skill/`)

A knowledge-based skill that gives Claude structured UX workflows, reference materials, and templates. **Recommended for most users.**

```
skill/
├── SKILL.md                    # Main skill definition
├── reference/
│   ├── HEURISTICS.md          # Nielsen's heuristics + severity scale
│   └── CHECKLISTS.md          # Forms, a11y, navigation, responsive
└── templates/
    ├── UX_AUDIT.md            # Audit output template
    ├── DESIGN_SPEC.md         # Implementation spec template
    └── USABILITY_TEST.md      # User testing plan template
```

### Installation

Copy the `skill/` directory to your project's `.claude/skills/` folder:

```bash
cp -r skill/ /path/to/project/.claude/skills/ux-webapp/
```

### What It Does

- UX audits with Nielsen heuristics
- Design specs with acceptance criteria
- Accessibility reviews (WCAG 2.2 AA)
- User flow design and wireframes
- Usability test planning
- Microcopy improvements

See [`skill/README.md`](skill/README.md) for full documentation.

---

## 2. MCP Server (`src/`)

An executable MCP server with tools for automated analysis. Use this if you want programmatic HTML analysis.

### Tools

- `ux_extract_ui_inventory` - Parse HTML into structured inventory (headings, links, buttons, forms, issues)
- `ux_accessibility_axe_audit` - Run axe-core accessibility audit
- `ux_readability_lint` - Compute readability metrics (Flesch scores)

### Resources

- `ux://framework/nielsen-heuristics`
- `ux://framework/pour-wcag`
- `ux://checklist/forms`
- `ux://template/usability-test`

### Prompts

- `ux-heuristic-review`
- `ux-usability-test-plan`
- `ux-microcopy-variants`

### Installation

```bash
npm install
```

Add to Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ux": {
      "command": "node",
      "args": ["/path/to/ux-skill/src/index.js"]
    }
  }
}
```

### Limitations

- Accessibility audit uses JSDOM (no JavaScript execution)
- Color contrast checks disabled (JSDOM can't compute styles)
- Treat results as quick signals; verify in a real browser

---

## License

MIT
