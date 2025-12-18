# UX Web App Skill for Claude

A Claude skill plugin for professional UX work on web applications. Provides structured workflows for usability audits, accessibility reviews, design specs, and user testing.

## What This Skill Does

When activated, this skill gives Claude structured approaches for:

- **UX Audits**: Heuristic evaluation using Nielsen's 10 heuristics + accessibility
- **Design Specs**: Implementation-ready specifications with acceptance criteria
- **Flow Design**: User flows, wireframes (textual), information architecture
- **Accessibility Reviews**: WCAG 2.2 AA baseline checks
- **Microcopy**: Error messages, button labels, helper text
- **Usability Testing**: Test plans with tasks, metrics, and analysis frameworks

## Installation

### Claude Code CLI

Copy the skill directory to your project or add it to your Claude Code configuration:

```bash
# Copy to your project
cp -r skills/ux-webapp/ /path/to/your/project/.claude/skills/ux-webapp/

# Or symlink it
ln -s /path/to/ux-skill/skills/ux-webapp /path/to/your/project/.claude/skills/ux-webapp
```

### Claude Desktop

Add the skill path to your Claude Desktop configuration.

## Usage

### Slash Commands

The skill provides three slash commands for direct invocation:

| Command | Use Case |
|---------|----------|
| `/ux-audit` | Run a UX audit on a screen, flow, or codebase |
| `/design-spec` | Create an implementation-ready design specification |
| `/usability-test` | Create a usability test plan |

### Natural Language

You can also ask Claude for UX help directly:

- "Can you UX-audit our signup flow?"
- "Design the flow for creating a project and inviting teammates"
- "Make this settings page accessible and keyboard-friendly"
- "Write a design spec for the new checkout feature"
- "Our users keep failing at CSV imports—fix the UX"

Claude will automatically use the skill's workflow, reference materials, and templates.

## Structure

```
skills/ux-webapp/
├── SKILL.md                    # Core skill definition (~130 lines)
├── README.md                   # This file
├── .claude/
│   └── commands/
│       ├── ux-audit.md         # /ux-audit command
│       ├── design-spec.md      # /design-spec command
│       └── usability-test.md   # /usability-test command
├── reference/
│   ├── HEURISTICS.md          # Nielsen's 10 heuristics + cognitive laws
│   ├── CHECKLISTS.md          # Forms, a11y, navigation, responsive checklists
│   ├── WORKFLOW.md            # Detailed workflow steps (0-7)
│   └── WEB_APP_PATTERNS.md    # Auth, API latency, forms, error handling
├── templates/
│   ├── UX_AUDIT.md            # Audit output template
│   ├── DESIGN_SPEC.md         # Implementation spec template
│   └── USABILITY_TEST.md      # User testing plan template
└── examples/
    └── LOGIN_AUDIT_EXAMPLE.md  # Worked example showing expected output
```

## Key Features

### Severity Scoring (0-4)
- 0: Not a problem
- 1: Cosmetic (fix when convenient)
- 2: Minor (fix next sprint)
- 3: Major (prioritize fix)
- 4: Critical (fix immediately)

### Issue Reporting Format
Issues are reported with: Location, Problem, Evidence, Heuristic, Severity, Recommendation, and Acceptance Criteria.

### Principle-Based Rationale
Every recommendation cites a heuristic (H1-H10) or cognitive law (L1-L5). No "vibes."

### Acceptance Criteria
All recommendations include testable Given/When/Then acceptance criteria.

### Accessibility Baseline
Built on WCAG 2.2 AA with practical checks for keyboard, focus, labels, contrast, and target sizes.

## Example Output

When you ask for a UX audit, you'll get:

1. **Flow map** of the critical path (Mermaid diagram)
2. **Prioritized issue backlog** with severity ratings
3. **Quick wins** (low effort, high impact)
4. **Larger improvements** with effort/impact assessment
5. **Validation plan** for uncertain changes
6. **Accessibility notes** mapped to WCAG criteria

See `examples/LOGIN_AUDIT_EXAMPLE.md` for a complete worked example.

## License

MIT
