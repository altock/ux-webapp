Perform a UX audit on the provided screen, flow, or codebase.

## Instructions

1. **Gather Visual Context First**
   - If browser tools available: capture screenshots of the flow
   - If not: request screenshots from user or note "code-only review"

2. **Apply the UX Audit Workflow**
   - Use the workflow from `reference/WORKFLOW.md` (Steps 0-6)
   - Reference `reference/HEURISTICS.md` for severity scoring
   - Reference `reference/CHECKLISTS.md` for systematic coverage

3. **Output Using Template**
   - Follow `templates/UX_AUDIT.md` structure
   - Include flow map (Mermaid diagram when possible)
   - Prioritize issues by severity and impact

4. **Required Sections**
   - Context and assumptions
   - Flow map of critical path
   - Issue backlog with: Location, Problem, Evidence, Heuristic, Severity, Recommendation, Acceptance Criteria
   - Quick wins vs larger improvements
   - Accessibility notes

Cite specific heuristics (H1-H10) or cognitive laws (L1-L5) for every issue. No "vibes."

See `examples/LOGIN_AUDIT_EXAMPLE.md` for expected output quality.
