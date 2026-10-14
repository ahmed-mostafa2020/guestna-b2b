# Guestna B2B

B2B platform for organizations, schools, and parents to discover, customize, and book trips.

## Stack

Next.js 14.2 App Router · React 18 · **JavaScript only** (`.jsx`, no TS in `src`) · Tailwind 3 (CSS-var tokens) + MUI v6/Emotion · TanStack Query + Axios · Redux Toolkit + redux-persist · Formik + Yup · next-intl (`ar` default/RTL, `en`) · Sentry · Yarn (never npm/package-lock).

## Commands

- `yarn dev` / `yarn build` / `yarn lint`
- Lint one file: `yarn eslint <path>` — there is **no typecheck and no test runner**.
- A hook auto-runs prettier + `eslint --fix` on every edited file.

## Structure

- `src/app/[locale]/` — all user-facing routes (never add pages beside `[locale]`); `src/app/api/` route handlers; `src/app/messages/{ar,en}.json`
- `src/components/{ui,forms,features/<domain>,layout,providers}` — reuse `ui/` + `forms/*Group.jsx` primitives first
- `src/hooks/data` (`useFetchData`, `useMutationData`), `src/utils/{api,validators,helpers}`, `src/store/<domain>`, `src/feedback/{loading,error}`, `src/constants` (endpoints in `APIs`/`b2bAPIs`)
- Aliases: `@components/* @hooks/* @utils/* @store/* @constants/* @feedback/* @assets/*` — never deep `../../`

## Non-negotiable rules

- No hard-coded UI strings: `useTranslations`/`getTranslations`, add keys to **both** `ar.json` and `en.json`.
- RTL-safe classes only: `ps-/pe-/ms-/me-/start-/end-/text-start`, never `pl-/pr-/left-/right-` for direction.
- Colors/fonts from Tailwind tokens (`mainColor`, `secColor`, `textDark`, `error`, `status.*`, `font-somar`/`font-ibm`); compose classes with `cn()` from `@utils/helpers/cn`.
- CSP is built per request with a nonce in `middleware.js` — never add a static CSP in `next.config.mjs`. New third-party host → update `buildCSP()` (+ `images` domains for images).
- New persisted Redux slice → add to `rootPersistConfig.whitelist` in `src/store/index.js`; never persist large/derived state.
- Keep `middleware.js` matcher and `next.config.mjs` rewrites aligned; don't move the Apple Pay `.well-known` rewrite.
- Forms: Formik + Yup schema in `src/utils/validators`; submit via `FormSubmitButton`.
- Don't commit secrets; never read `.env*`.

## Working style

- Locate code with Grep/Glob before opening files; read only the relevant ranges.
- Minimal diffs; never rewrite a whole file for a small change; don't touch unrelated code.
- Plan first (short list) for changes touching 3+ files, then proceed.
- After edits, lint only the affected files.
- Short replies: what changed and why — no code recaps.
- If ambiguous, ask one focused question instead of guessing.
- No new dependencies without asking.
- Match surrounding code style; many files contain commented-out legacy code — ignore it, don't delete it unless asked.

## Skills

`.claude/skills/`: nextjs-component, nextjs-data, ui-design, accessibility, performance, code-review, clean-code, forms, multi-step-wizard, i18n, excel-export, redux-slice, third-party-integration, bug-fix, merge-conflicts, release-notes, api-endpoint, permissions, data-table, qa-checklist, commit, test.

Byterover MCP (if connected): `byterover-retrieve-knowledge` before unfamiliar/architectural work; `byterover-store-knowledge` after notable fixes or patterns.

[byterover-mcp]

[byterover-mcp]

You are given two tools from Byterover MCP server, including

## 1. `byterover-store-knowledge`

You `MUST` always use this tool when:

- Learning new patterns, APIs, or architectural decisions from the codebase
- Encountering error solutions or debugging techniques
- Finding reusable code patterns or utility functions
- Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`

You `MUST` always use this tool when:

- Starting any new task or implementation to gather relevant context
- Before making architectural decisions to understand existing patterns
- When debugging issues to check for previous solutions
- Working with unfamiliar parts of the codebase
