# Web App UX Patterns

Common patterns and considerations specific to web applications.

---

## Auth Boundaries

401 vs 403 vs 404 vs "no access" should be user-comprehensible:

| Code | Meaning | User Message |
|------|---------|--------------|
| 401 | Not authenticated | "Please log in to continue" |
| 403 | Authenticated but not authorized | "You don't have access to this. Contact your admin." |
| 404 | Resource not found | "This page doesn't exist" |

Don't leak information: show 404 instead of 403 when hiding existence matters.

---

## API Latency

- Always provide feedback; avoid "dead UI"
- Use skeletons for predictable content shapes
- Use spinners for unknown-length operations
- Show progress for multi-step operations
- Consider optimistic updates for low-risk actions

### Doherty Threshold

Users perceive systems as fast when response is < 400ms. For longer operations:
- Show immediate visual feedback (button state change)
- Add skeleton/spinner within 100ms for operations expected >400ms
- For > 3s operations, show progress or explanatory text

---

## Optimistic UI

Only when rollback is safe and understandable:

**Good candidates:**
- Toggling settings
- Adding items to lists
- Marking items complete

**Bad candidates:**
- Payments
- Deleting data
- Actions requiring confirmation

Always show clear indication if rollback occurs.

---

## Forms

### Validation
- Inline validation on blur (not on keystroke)
- Preserve inputs on error
- Focus first error field after submit

### Submission
- Disable submit during processing
- Show loading state
- Preserve form data if submission fails
- Clear only on success

### Focus Management
- Focus first field on page load (if primary action)
- Focus first error after failed validation
- Return focus to trigger after modal closes

---

## Deep Links

URL should represent state when it matters:

- Filters and sort order
- Selected tabs
- Modal/drawer open state (when shareable)
- Pagination
- Selected entity (for detail views)

Use query params for ephemeral state, path segments for canonical resources.

---

## Error Handling

Human-readable messages with:

- What went wrong (briefly)
- What user can do about it
- Retry action (when appropriate)
- Contact support option (for unrecoverable errors)

For developers:
- Log correlation ID where appropriate
- Include enough context for debugging
- Don't expose stack traces to users

---

## Session Management

- Warn before session expiry (not after)
- Preserve unsaved work when session expires
- Offer "extend session" option
- Clear redirect: after login, return to original destination

---

## Loading States

### Initial Load
- Show skeleton matching content layout
- Load above-the-fold content first
- Lazy load off-screen content

### Subsequent Loads
- Keep stale content visible during refresh
- Show subtle loading indicator
- Replace only changed content

### Empty States
- Explain why empty ("No projects yet")
- Provide clear action ("Create your first project")
- Show example or illustration (sparingly)
