---
name: merge-conflicts
description: Use when merging main into a feature branch (or a branch into main), resolving git merge/rebase conflicts, or when git status shows "both modified" files.
---

# Merging & resolving conflicts

## Before merging

1. `git status` — the working tree must be clean. If not, ask whether to commit or stash first (never discard changes).
2. `git fetch` then `git merge origin/main` (or the branch the user names). Don't rebase shared branches unless asked.

## Resolve

List conflicts: `git diff --name-only --diff-filter=U`.
For each file, understand **both** sides before editing (`git log --oneline -3 main -- <file>` and the same for the branch).

### `src/app/messages/ar.json` / `en.json` (most common)

- Almost always **union**: keep keys from both sides. If the same key has different values, prefer the newer wording from main unless the branch changed it deliberately.
- Remove the conflict markers and fix commas/braces. Validate:
  `node -e "require('./src/app/messages/ar.json');require('./src/app/messages/en.json')"`
- Then run `node .claude/skills/i18n/scripts/check-keys.js` and confirm you didn't introduce new gaps.

### Validators / schemas, constants (`STEP_FIELDS`, endpoints)

- Merge both sets of fields/rules. Check that `STEP_FIELDS`, `INITIAL_VALUES`, and the schema still line up.

### `src/store/index.js`

- Keep every slice import, every `combineReducers` entry, and every whitelist entry from both sides.

### `middleware.js` / `next.config.mjs`

- Union of CSP hosts, rewrites, and matcher entries. Keep them aligned. Never drop the Apple Pay rewrite.

### Components

- If both sides changed logic, combine the intents. If they truly conflict, **stop and ask** with a short description of each side.

### Never

- `yarn.lock` hand-edits → take main's version, then run `yarn install` so yarn regenerates it. Never create `package-lock.json`.
- Blanket `git checkout --ours/--theirs .`.

## After resolving

1. `git diff --check` (no leftover markers/whitespace errors) and Grep for `<<<<<<<|>>>>>>>`.
2. `yarn eslint` on the conflicted files.
3. Run the `test` skill (lint + build).
4. `git add` the resolved files. Then show a summary and wait for OK before `git commit` (default merge message is fine). Don't push unless asked.

## Report

- Which files conflicted, how each was resolved (union / took main / took branch / combined), and anything that needs a manual check.
