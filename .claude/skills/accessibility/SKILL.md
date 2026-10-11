---
name: accessibility
description: Use when building or reviewing interactive UI — forms, buttons, modals/dialogs, dropdowns/menus, tabs, steppers, tables, images, icons — or when the user mentions a11y, keyboard, screen reader, focus, ARIA, or contrast.
---

# Accessibility in Guestna B2B

## Semantic HTML first
- Clickable thing that navigates → `<Link>` from `next-intl` navigation / `next/link`; performs action → `<button type="button">`. Never `<div onClick>`.
- One `<h1>` per page; don't skip heading levels for styling — restyle instead.
- Lists of cards → `<ul>/<li>`; tabular data → `<table>` with `<th scope>` (see `ui/DataTable`).
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>` in layouts.

## Forms (Formik inputs)
- Every input has a `<label htmlFor>` — `TextInputGroup` does this via `id || name`; always pass `label` or an `aria-label`.
- Link errors: add `aria-invalid={touched && !!errors}` and `aria-describedby={`${name}-error`}` with matching `id` on the error node when building/editing input primitives.
- Required: visual `*` plus `required`/`aria-required`.
- On failed submit, focus the first invalid field (multi-step forms: jump to the step via `findFirstStepWithErrors`, then focus).
- Use correct `type`/`inputMode`/`autoComplete` (`email`, `tel`, `given-name`).

## Keyboard
- Everything reachable with Tab in visual (RTL) order; no positive `tabIndex`.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-mainColor`. Don't ship `outline-none` without a replacement.
- Icon-only buttons (password toggle, close, arrows) need `aria-label={t("...")}`.
- Custom widgets: Enter/Space activate, Esc closes, arrows move within tabs/menus/radios.

## Dialogs & menus
- Prefer MUI `Dialog`/`Menu`/`Popover` (via `ui/customizedModal`) — they trap focus, restore it, and close on Esc.
- Dialog needs `aria-labelledby` pointing at its title.
- Custom popovers: return focus to the trigger on close; trigger gets `aria-expanded` + `aria-controls`.

## Images & icons
- `next/image` content images: meaningful `alt` (translated). Decorative: `alt=""`.
- Inline SVGs from `@assets/svg` that are decorative: `aria-hidden="true"`.

## Dynamic content
- Snackbars (notistack) announce visually only — for critical form errors also render inline text.
- Loading regions: `aria-busy="true"`; skeletons `aria-hidden`.
- Stepper (`BookingStepper`): current step `aria-current="step"`.

## Color & contrast
- Body text ≥ 4.5:1, large text/UI ≥ 3:1. `textLight` on white and white on `secColor` are borderline — check before using for essential text.
- Never convey status by color alone — status pills include text.

## i18n
- `<html lang dir>` is set per locale in `[locale]/layout.jsx` — don't hard-code `dir`.
- ARIA strings are translated like any other copy.

## ARIA rule
Use ARIA only when native semantics can't express it. Wrong ARIA is worse than none.
