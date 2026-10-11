---
name: ui-design
description: Use when designing or restyling visible UI — layouts, cards, sections, tables, modals, buttons, responsive behavior, spacing, colors, typography, hover/focus states, or animation — or when implementing a Figma design in this project.
---

# UI design in Guestna B2B

## Tokens (tailwind.config.js → CSS vars in src/app/globals.css)
- Brand: `mainColor` (#007473 teal — primary actions, links, focus borders), `secColor` (#f09814 orange — accents, badges; sparingly).
- Text: `titleColor` (headings), `textDark` (body), `textLight` (meta, placeholders, disabled labels).
- Surfaces: `homeBg`, `packageDetailsBg`, `sidePageBg`, `headerBg`, white cards.
- States: `linksHover`, `buttonsHover`, `error`, `success`, `disabled`, `border`.
- Status pills: `bg-status-{success|warning|info|hold|danger|neutral}-bg` + `-fg` + `-border` (already safelisted).
- Shadows: `shadow-card`, `shadow-tag`, `shadow-profile`. Fonts: `font-somar` (headings/brand), `font-ibm` (body/forms).
- **Never hard-code hex** in className/sx; if a color is missing, add a CSS var + token.
- MUI components: style via `sx` using the same values (`color: "var(--color-main)"`).

## Layout & spacing
- Mobile-first: base classes for ~375px, then `md:`, `lg:`, `3xl:`. Test RTL (`ar`) first — it's the default.
- Use the 4px Tailwind scale; stick to `gap-2/4/6/8`, section padding `py-8 md:py-12`. No arbitrary `mt-[13px]`.
- Logical properties only: `ps/pe/ms/me/start/end/text-start`. Icons that imply direction (arrows, chevrons) flip with `rtl:rotate-180`.
- Use `ui/responsiveGridLayout` and existing section frames (`frameWithImagedHeader`, `sliderWithArrowsSection`) before new wrappers.
- Inputs are `h-[55px] rounded-lg border-2 border-border` (see `TextInputGroup`) — match them.

## Hierarchy
- One primary action per view (`bg-mainColor text-white`); secondary = outlined `border-mainColor text-mainColor`; tertiary = text link.
- Heading scale: page `text-2xl md:text-3xl font-bold font-somar text-titleColor`, section `text-xl`, card `text-base font-semibold`.
- Meta info in `text-sm text-textLight`. Limit to 2 font weights per component.
- Group with whitespace before adding borders/dividers.

## Interactive states — all required
- hover: `hover:bg-linksHover` / `hover:border-mainColor`
- focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainColor focus-visible:ring-offset-2` (never remove focus without replacement)
- active: `active:scale-[0.98]`
- disabled: `disabled:opacity-50 disabled:cursor-not-allowed` (see `FormSubmitButton`)
- loading: spinner + translated label, same button width (no layout jump)

## Motion
- `transition-all duration-200 ease-in-out` is the house default. Keep durations 150–300ms.
- Wrap decorative animation (`animate-pumping`, `animate-rotation`, sliders autoplay) with `motion-safe:` or disable under `motion-reduce:`.

## Avoid "template look"
- No generic hero + three identical icon cards; lead with real content (trip imagery, prices, dates).
- Use real data density: tables/cards show the fields users decide on (price, date, seats, status pill).
- Consistent radii (`rounded-lg` controls, `rounded-xl/2xl` cards) — don't mix arbitrarily.
- Empty states: illustration from `@assets` + translated message + one action.
- No dark mode in this app — don't add `dark:` classes.
