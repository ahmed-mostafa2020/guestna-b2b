---
name: qa-checklist
description: Use when the user says a feature is "ready for QA", asks for a test plan, test cases, a QA handoff, "what should I test", or wants to self-check a change/branch before handing it to QA.
---

# QA checklist / handoff

Goal: catch what QA usually sends back, before handing over. Output a short, **specific** checklist for this change, not a generic one.

## 1. Scope the change

- `git diff --stat main...HEAD` (or the uncommitted diff / the commits the user names).
- Map the files to **screens and flows** a user would touch: routes under `src/app/[locale]/…`, the forms, the tables.
- Note what is shared and could regress elsewhere: `ui/*`, `forms/*Group.jsx`, validators, store, `middleware.js`, `useFetchData`.

## 2. Build the checklist (only the rows that apply)

**Happy path:** the main flow step by step, with the expected result.

**Users & permissions**

- Visitor (logged out) → login modal or redirect works.
- Each relevant role (parent, school admin, staff manager/finance/STMS, provider): sees only what they should.
- Logged-in vs guest variants of the same flow (e.g. auth vs guest booking forms).

**Language & direction**

- Arabic (RTL) and English: no missing-key text, layout mirrored, icons flipped, numbers and phones readable.

**Forms**

- Required fields, invalid formats (Saudi phone, email, national ID, IBAN), and max lengths show errors in both languages.
- Double-click submit doesn't create duplicates. A server error keeps the entered values.
- Multi-step: Back keeps data; submit with an error jumps to the right step; edit mode is pre-filled.

**Data states:** loading skeleton, empty, no-results-after-filter, API error with retry, long text, a very large list.

**Responsive:** mobile (≈375px), tablet, desktop; no horizontal scroll; modals usable on mobile.

**Payments (if touched):** card, Tamara, STC, Apple Pay (Safari); cancel or failed payment returns cleanly; amounts include VAT.

**Exports (if touched):** file opens; Arabic sheet is RTL; phones keep their leading zero; all rows are exported, not just one page.

**Regression:** the 2–3 other screens that use the shared code you changed.

## 3. Pre-flight (run before handing over)

- `yarn lint` on the changed files; `node .claude/skills/i18n/scripts/check-keys.js` (0 missing).
- `yarn build` if routes, server components, config or middleware changed.
- No `console.log` or debug UI left (Grep the diff).

## 4. Output format

```
**QA Handoff — <feature> — <date>**
Where: <screens / URLs>   Accounts needed: <roles>

Test cases
1. <Action> → <expected>
2. ...

Edge cases
- ...

Regression to check
- ...

Known limitations / not in scope
- ...
```

Keep it in plain language (QA may not read code). No file names unless QA asks.
