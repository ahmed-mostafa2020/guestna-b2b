---
name: code-review
description: Use when the user asks to review changes, a diff, a branch, a commit, or "my code" before committing/merging in this repo. Read-only review of the git diff — never edits files.
---

# Code review (read-only)

## Scope
1. `git status` then `git diff` (unstaged) + `git diff --staged`; for a branch: `git diff main...HEAD`.
2. Review **only changed hunks**. Open surrounding lines (`Read` with offset/limit) only when a hunk can't be judged alone. Never read whole unrelated files.
3. Do not edit anything. Do not run builds. `yarn eslint <changed files>` is allowed.

## Check order
1. **Bugs / edge cases** — null/undefined API fields (`data?.x`), empty arrays, loading vs error branches, stale closures in effects, missing effect deps, wrong Formik field names vs Yup schema, unhandled promise rejections, `useMutationData` hook-level `onSuccess` receiving a non-action (it's dispatched to Redux).
2. **Server/client boundary** — hooks/Redux/Cookies in a file without `"use client"`; `"use client"` on a whole page when only a leaf needs it; non-serializable props to client components; secrets in `NEXT_PUBLIC_*`.
3. **Project rules** — hard-coded strings (missing `ar.json`/`en.json` keys), `pl-/pr-/left-/right-` instead of logical classes, hex colors instead of tokens, deep relative imports, static CSP in `next.config.mjs`, new third-party host missing from `buildCSP()`, new persisted slice not whitelisted.
4. **Performance** — raw `<img>`, missing `sizes`, heavy libs imported eagerly, barrel MUI icon imports, unstable `useFetchData` params, whole-state `useSelector`.
5. **Accessibility** — div-buttons, missing labels/alt, icon buttons without `aria-label`, removed focus outlines.
6. **Types/props** — inconsistent prop names vs existing primitives, missing defaults, undocumented shared `ui/` props.
7. **Consistency** — reinvented primitive that exists in `components/ui` or `components/forms`, naming, leftover `console.log`, dead code added.

## Output format
```
### Must fix
- src/components/forms/X.jsx:42 — `values.date` can be null → guard with `values.date && dayjs(values.date)`.

### Should fix
- src/app/[locale]/trips/page.jsx:8 — whole page is "use client" for one toggle → move toggle to a leaf component.

### Nit
- src/components/ui/Card.jsx:15 — `pl-4` → `ps-4` (RTL).
```
- Each item: `file:line — problem → one-line fix`.
- Omit empty sections. If nothing is wrong, say "No issues found" plus at most 2 nits.
- No praise, no summary of what the diff does, no rewritten code blocks beyond a one-liner.
