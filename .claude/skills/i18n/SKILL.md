---
name: i18n
description: Use when adding, renaming, or removing UI text / translation keys, touching src/app/messages/ar.json or en.json, fixing "missing message" errors, auditing hard-coded strings, or checking that ar and en are in sync.
---

# Translations (next-intl) in Guestna B2B

## Setup

- Locales: `ar` (default, RTL) and `en` — config in `i18n.config.js`.
- Messages: `src/app/messages/ar.json` + `en.json` (~5.7k lines each). **Every key goes into both files in the same change.**
- Client: `const t = useTranslations();` then full paths `t("schoolTripBooking.steps.details")` (the dominant style). A scoped `useTranslations("providerProfile.products.modal")` is fine when the file already does it.
- Server: `const t = await getTranslations();` in pages / `generateMetadata`.

## Adding keys

1. Find the right namespace first (Grep the feature name in `en.json`); reuse `common.*` (buttons, statuses, errors) before creating new keys.
2. Nest by feature → section → item: `profile.myWallet.withdrawPage.form.amount.label`. camelCase segments. No new top-level namespace unless it's a new feature area.
3. Insert at the **same path and position** in both files using Edit on the surrounding block — never rewrite the whole JSON.
4. Arabic must be real Arabic (not English copy). If unsure of wording, write your best Arabic and flag it in the reply for review.
5. Interpolation: `"{count} طالب"` + `t("key", { count })`; plurals via ICU `{count, plural, one {...} other {...}}` — same placeholders in both files.
6. Validation messages live under `forms.validation.*` / `validations.*`; schema factories take `t`.

## Sync check

Run after any messages edit:

```
node .claude/skills/i18n/scripts/check-keys.js            # whole file
node .claude/skills/i18n/scripts/check-keys.js profile.   # one namespace
```

Fix only gaps in the area you touched; report other pre-existing gaps instead of fixing them unasked.

## Hard-coded string audit

- Grep JSX text and props for literals: `>[A-Za-z؀-ۿ][^<{]*<`, `placeholder="`, `label="`, `title="`, `aria-label="`, `enqueueSnackbar\("`.
- Exclude test ids, class names, keys, and URLs.
- Toasts, Yup messages, Excel headers, `alt`, and `aria-*` must be translated too.

## RTL reminders when adding text

- Logical classes only (`ps-/pe-/ms-/me-/start-/end-/text-start`).
- Numbers/phones/emails inside Arabic text: wrap in `<span dir="ltr">`.
- Directional icons (arrows, chevrons) flip with `rtl:rotate-180`.

## Checklist

- [ ] Key in both files, same path
- [ ] `check-keys.js` clean for the touched namespace
- [ ] No literal UI strings left in edited components
- [ ] Placeholders identical in ar/en
