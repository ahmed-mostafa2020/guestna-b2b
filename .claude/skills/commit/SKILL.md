---
name: commit
description: Use when asked to commit, write a commit message, or "commit my changes". Writes a Conventional Commit message from the staged diff and commits after confirmation.
model: haiku
---

# Commit

1. Run `git status --short` and `git diff --staged --stat`.
   - If nothing is staged, ask whether to stage all changes (`git add -A`) or specific files. Never stage `.env*` or `.claude/settings.local.json`.
2. Read the staged diff (`git diff --staged`). If it is very large (>500 lines), read only the most important files and rely on `--stat` for the rest.
3. Write the message:
   - Format: `type(scope): summary` — types: feat, fix, refactor, style, perf, test, docs, chore
   - Summary: imperative, lowercase, no period, max 72 chars
   - Scope = feature/folder name when clear (e.g. `feat(add-product): ...`)
   - Body (optional): 1-3 bullets for the "why" when not obvious. No body for small changes.
   - If changes are unrelated, suggest splitting into separate commits.
4. Show the message and wait for my OK, unless I said "commit directly".
5. Commit with `git commit -m "..."`. Do not push unless asked.
