---
name: release-notes
description: Use when asked for release notes, a release summary, a changelog, "what did we ship", a status update for the lead, or a summary of a branch/merge/date range for QA or stakeholders.
---

# Release notes for the lead

Audience: a non-technical lead / product stakeholder. They want to know what changed in the product, not how it was built.

## Gather

1. Ask (or infer) the range: since a date, since a tag/commit, a branch vs `main`, or "today".
   - `git log --since="<date>" --no-merges --pretty="%h %ad %s" --date=short`
   - Branch: `git log main..<branch> --no-merges --pretty="%h %s"`
2. Commit messages here are often vague ("fixed bug", "updates done"). For each unclear one, run `git show --stat <hash>` and skim the diff, enough to name the **user-facing** effect.
3. Group commits by feature/screen; drop pure refactors, lint, config, and "merge" noise unless they have visible impact (speed, stability).

## Write

```
**Release Notes — <Date>**
**Status:** Ready for QA | In Review | Released

### New Features
- <What a user can now do, in plain words>

### Enhancements & Fixes
- <What was broken/awkward → now works>

### Reports / Operations
- <Exports, admin tools, performance, stability>
```

- English by default; Arabic only if asked.
- Short, punchy bullets in user language: "Parents can now register multiple children in one form."
- **Never** mention file names, paths, components, functions, libraries, commit hashes, or branch names.
- Name screens the way users see them (e.g. "Trip details page", "Bookings management").
- Omit empty sections. Add "Known Issues / Next" only if something is explicitly unfinished.

## Deliver

- Output the notes in chat, ready to paste.
- If they asked for a doc or a page to share, publish it the way they request.
