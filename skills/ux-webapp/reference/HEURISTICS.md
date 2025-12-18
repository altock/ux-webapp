# Heuristics & Severity Scoring

## Nielsen's 10 Usability Heuristics

Use these labels when categorizing issues in audits:

### H1: Visibility of System Status
The system should always keep users informed about what is going on through appropriate feedback within reasonable time.

**Check for:**
- Loading indicators for async operations
- Progress feedback for multi-step processes
- Confirmation of completed actions
- Real-time validation feedback

### H2: Match Between System and Real World
The system should speak the users' language, with words, phrases, and concepts familiar to the user.

**Check for:**
- Jargon-free labels and terminology
- Icons that match real-world metaphors
- Information appearing in natural, logical order
- Date/time/currency formats matching user locale

### H3: User Control and Freedom
Users often choose system functions by mistake and need a clearly marked "emergency exit" to leave the unwanted state.

**Check for:**
- Undo/redo capabilities
- Cancel buttons on dialogs and forms
- Back navigation that preserves state
- Easy way to dismiss notifications/modals (Escape key)

### H4: Consistency and Standards
Users should not have to wonder whether different words, situations, or actions mean the same thing.

**Check for:**
- Consistent button placement and styling
- Same terminology used throughout
- Platform conventions followed (e.g., link styling)
- Consistent patterns for similar interactions

### H5: Error Prevention
Even better than good error messages is a careful design which prevents a problem from occurring in the first place.

**Check for:**
- Confirmation dialogs for destructive actions
- Constraints that prevent invalid input
- Smart defaults that reduce errors
- Clear affordances (buttons look clickable)

### H6: Recognition Rather Than Recall
Minimize the user's memory load by making objects, actions, and options visible.

**Check for:**
- Visible options rather than memorized commands
- Context displayed where needed (not hidden)
- Recently used items accessible
- Helpful placeholder text and examples

### H7: Flexibility and Efficiency of Use
Accelerators—unseen by the novice user—may speed up interaction for the expert user.

**Check for:**
- Keyboard shortcuts for power users
- Recent/favorites for frequently accessed items
- Bulk actions for repetitive tasks
- Customizable workflows

### H8: Aesthetic and Minimalist Design
Dialogues should not contain information which is irrelevant or rarely needed.

**Check for:**
- Visual hierarchy guides attention
- Only relevant information displayed
- Progressive disclosure for complexity
- Adequate whitespace and grouping

### H9: Help Users Recognize, Diagnose, and Recover from Errors
Error messages should be expressed in plain language, precisely indicate the problem, and constructively suggest a solution.

**Check for:**
- Plain language error messages (no codes)
- Specific indication of what went wrong
- Actionable suggestion for fixing
- Easy path to retry or get help

### H10: Help and Documentation
Even though it is better if the system can be used without documentation, it may be necessary to provide help.

**Check for:**
- Contextual help where needed
- Searchable documentation
- Task-oriented help content
- Tooltips for complex features

---

## Severity Scale (0-4)

Use this scale when rating issues:

| Severity | Label | Definition | Action |
|----------|-------|------------|--------|
| 0 | Not a problem | Doesn't affect users negatively | No action needed |
| 1 | Cosmetic | Doesn't impede task completion; minor polish issue | Fix when convenient |
| 2 | Minor | Causes friction or mild error risk; workaround exists | Fix in next sprint |
| 3 | Major | Frequently blocks tasks or causes serious mistakes | Prioritize fix |
| 4 | Critical | Prevents task completion, causes data loss, or severe trust/safety issues | Fix immediately |

---

## Evidence Rules

When documenting issues:

- **Prefer concrete evidence**: screenshots, reproduction steps, user quotes, analytics
- **If evidence is missing**: mark as "inferred" and propose a validation step
- **Avoid vague labels**: replace "confusing" with specific problems like:
  - "Users must remember X from a previous screen"
  - "Primary action competes visually with secondary action"
  - "Validation errors appear after submit and do not indicate which field"

---

## Quick Heuristic Evaluation Checklist

For rapid assessment, ask these questions:

1. **Status**: Does the user always know what's happening?
2. **Language**: Would a new user understand all the terminology?
3. **Control**: Can users easily undo, cancel, or go back?
4. **Consistency**: Are similar things done the same way throughout?
5. **Prevention**: Are dangerous actions protected? Are errors prevented?
6. **Memory**: Can users complete tasks without memorizing things?
7. **Efficiency**: Are there shortcuts for frequent tasks?
8. **Clarity**: Is only relevant information shown?
9. **Recovery**: Do error messages explain how to fix the problem?
10. **Help**: Is contextual help available where needed?
