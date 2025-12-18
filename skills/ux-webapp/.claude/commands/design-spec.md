Create an implementation-ready design specification for a feature or flow.

## Instructions

1. **Clarify Scope**
   - Identify the feature/surface being specified
   - Understand the problem being solved
   - Define success metrics and non-goals

2. **Document the Design**
   - Use `templates/DESIGN_SPEC.md` structure
   - Define happy path flow with system responses
   - Cover all edge cases and failure modes

3. **Required Sections**
   - Overview (feature, problem, goal, non-goals)
   - Users and scenarios
   - Proposed flow (happy path)
   - Edge cases: validation errors, network timeout, 401/403, empty state, partial success
   - Interaction rules and keyboard behavior
   - States: loading, success, error, empty, disabled
   - Content and microcopy (labels, helper text, error messages)
   - Analytics events and funnel steps
   - Acceptance criteria in Given/When/Then format

4. **Quality Bar**
   - Every state must have defined visual and behavior
   - All error messages must be actionable
   - Accessibility requirements explicit (focus management, keyboard, labels)

Reference `reference/HEURISTICS.md` for principles and `reference/CHECKLISTS.md` for coverage.
