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

Copy the `skill/` directory to your project or add it to your Claude Code configuration:

```bash
# Copy to your project
cp -r skill/ /path/to/your/project/.claude/skills/ux-webapp/

# Or symlink it
ln -s /path/to/ux-skill/skill /path/to/your/project/.claude/skills/ux-webapp
```

### Claude Desktop

Add the skill path to your Claude Desktop configuration.

## Usage

Once installed, simply ask Claude for UX help:

- "Can you UX-audit our signup flow?"
- "Design the flow for creating a project and inviting teammates"
- "Make this settings page accessible and keyboard-friendly"
- "Write a design spec for the new checkout feature"
- "Our users keep failing at CSV imports—fix the UX"

Claude will automatically use the skill's workflow, reference materials, and templates.

## Structure

```
skill/
├── SKILL.md                    # Main skill definition
├── reference/
│   ├── HEURISTICS.md          # Nielsen's heuristics + severity scale
│   └── CHECKLISTS.md          # Forms, a11y, navigation, responsive checklists
└── templates/
    ├── UX_AUDIT.md            # Audit output template
    ├── DESIGN_SPEC.md         # Implementation spec template
    └── USABILITY_TEST.md      # User testing plan template
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

### Acceptance Criteria
All recommendations include testable Given/When/Then acceptance criteria.

### Accessibility Baseline
Built on WCAG 2.2 AA with practical checks for keyboard, focus, labels, contrast, and target sizes.

## Example Output

When you ask for a UX audit, you'll get:

1. **Flow map** of the critical path
2. **Prioritized issue backlog** with severity ratings
3. **Quick wins** (low effort, high impact)
4. **Larger improvements** with effort/impact assessment
5. **Validation plan** for uncertain changes
6. **Accessibility notes** mapped to WCAG criteria

## License

MIT
