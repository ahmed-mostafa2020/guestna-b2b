---
name: test
description: Use when asked to test, verify, or check that changes work — before committing, after resolving merge conflicts, or before merging a branch. This repo has no test runner; this skill runs static checks plus a production build.
---

# Test (verify changes)

There is **no test runner and no typecheck** in this repo. "Testing" = the checks below, run in order. Stop at the first failing step, report it with the exact output, and fix only if asked (or if the task was "test and fix").

## 1. Scope

- `git status --short` — note unmerged files (`UU`, `AA`, `DU`…) and changed files.
- Changed files: `git diff --name-only HEAD` (+ `git diff --name-only --staged`); for a branch: `git diff --name-only main...HEAD`.

## 2. Merge leftovers

- Conflict markers: `grep -rnE "^(<<<<<<<|=======|>>>>>>>)( |$)" src` → must be empty.
- Imports of deleted files: for every file deleted on main (`git log --diff-filter=D --name-only --since="3 months ago" -- src`), grep that its name is not imported anywhere.
  - Known removed component: `DropdownGroup` → use `@components/forms/SelectionGroup` (same props: `list`/`menuItemsList`, `label`, `labelClassName`, `placeholder`, `value`, `onChange`, `required`; includes Arabic-normalized search and single-option auto-select).

## 3. Translations

- Both files must parse:
  `node -e "JSON.parse(require('fs').readFileSync('src/app/messages/ar.json'));JSON.parse(require('fs').readFileSync('src/app/messages/en.json'))"`
- Key parity — every leaf key in `ar.json` exists in `en.json` and vice versa (flatten both with a small `node -e` script and diff). Report missing keys; don't invent translations.

## 4. Lint

- `yarn eslint <changed .js/.jsx files>` → **0 errors**. Pre-existing `no-unused-vars` warnings are fine; new warnings in code you touched are not.

## 5. Build

- `yarn build` (run in background, takes several minutes). Must finish with exit code 0.
- On failure, read the first error in the log (module not found, missing export, prerender error) — later errors usually cascade from it.

## 6. Behaviour review for touched forms

For Formik forms changed in the diff, read the handlers and check:

- `SelectionGroup` auto-select: the value a handler stores must equal the option id type (`"1"` vs `1`), otherwise the effect re-fires every render.
- Formik field names match the Yup schema in `src/utils/validators`.

## Report

```
Conflicts: ok | Imports: ok | i18n: ok (N keys) | Lint: 0 errors | Build: ok
Not verified: <what needs a manual browser check, e.g. submit flow, RTL layout>
```

Never claim a page "works" from these checks alone — say which flows still need a manual run in `yarn dev`.
