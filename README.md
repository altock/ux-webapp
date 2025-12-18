# ux-mcp-skill

An MCP server (“Claude skill”) that helps with UX work on web apps by providing:

- **Tools** for UI inventory extraction, quick accessibility audits (axe-core), and readability linting.
- **Resources** (heuristics, checklists, templates) you can reference while designing/reviewing.
- **Prompts** that standardize UX critique, usability test plans, and microcopy variants.

## What you get

### Tools

- `ux_extract_ui_inventory`: Parse HTML (URL/file/raw) into a structured list of headings, links, buttons, forms, images, and quick UX issues.
- `ux_accessibility_axe_audit`: Static axe-core audit in JSDOM (good for quick checks; verify in a real browser for full coverage).
- `ux_readability_lint`: Readability metrics (Flesch) + long-sentence flags from raw text or extracted HTML body text.

### Resources

- `ux://framework/nielsen-heuristics`
- `ux://framework/pour-wcag`
- `ux://checklist/forms`
- `ux://template/usability-test`

### Prompts

- `ux-heuristic-review`
- `ux-usability-test-plan`
- `ux-microcopy-variants`

## Install

```bash
npm install
```

## Run (manual smoke test)

```bash
npm start
```

It will wait for an MCP client over stdio (Claude Desktop will spawn it for you).

## Connect to Claude Desktop

1. In Claude Desktop: **Settings → Developer → Edit Config**
2. Add a server entry pointing at this repo’s `src/index.js` (absolute path required).

### macOS example

Config file location:

- `~/Library/Application Support/Claude/claude_desktop_config.json`

Example config:

```json
{
  "mcpServers": {
    "ux": {
      "command": "node",
      "args": ["/Users/YOUR_USER/code/uxSkill/src/index.js"]
    }
  }
}
```

Restart Claude Desktop. You should see the hammer icon and the `ux_*` tools.

### Windows notes

Config file location:

- `%APPDATA%\\Claude\\claude_desktop_config.json`

### Logs (macOS)

```bash
tail -n 50 -f ~/Library/Logs/Claude/mcp*.log
```

## Example asks (in Claude)

- “Run `ux_extract_ui_inventory` on my login page URL and tell me the top 5 UX risks.”
- “Run `ux_accessibility_axe_audit` on this HTML and summarize the highest-impact issues.”
- “Here are 3 error messages—use `ux_readability_lint` and rewrite them to be clearer.”

## Notes / limitations

- The accessibility audit uses **JSDOM** (no page JavaScript runs). Treat it as a fast signal, not a final verdict.
- `color-contrast` is disabled by default because JSDOM can’t reliably compute styles/colors.
