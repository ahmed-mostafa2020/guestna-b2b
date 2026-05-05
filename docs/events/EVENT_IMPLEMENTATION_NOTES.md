# Event Form Implementation — Lessons & Patterns

Reference for building any new event (graduation, summer camp, etc.).
Distilled from the `graduation-enhancements` branch. Apply these on day one
of a new event so we don't relearn the same fixes.

Working directory: `src/components/forms/events/<event>/`

---

## 1. Backend error extraction (REQUIRED on every API call)

Backend may return errors in two shapes:
- `{ message: "..." }`
- `{ info: [{ message: "..." }, { message: "..." }] }` (array, multi-field)

Replace ad-hoc `error.response?.data?.message` reads with a single helper at
the top of every form/widget file that talks to the API:

```js
const extractBackendError = (error, fallback) => {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (Array.isArray(data.info) && data.info.length > 0) {
    return data.info.map((i) => i.message).filter(Boolean).join(" | ");
  }
  return data.message || fallback;
};
```

Used in: [GraduationForm.jsx](../../src/components/forms/events/graduation/GraduationForm.jsx),
[GraduationAppleWidget.jsx](../../src/components/forms/events/graduation/GraduationAppleWidget.jsx).

**Rule:** never `alert(...)` for errors. Always `enqueueSnackbar(extractBackendError(error, fallback), { variant: "error" })`.

---

## 2. Two-step API flow (client first, then booking)

For events with a multi-step form (registration + payment), do NOT bundle
everything into one final POST. Split into two endpoints:

| Step | Endpoint                | Purpose                                    |
|------|-------------------------|--------------------------------------------|
| 1    | `POST /<event>/client`  | Create client, returns `_id`               |
| 2    | `POST /<event>/initiation` (or apple/tamara variants) | Create booking referencing `client: _id` |

Why: server-side validation of name/email/phone/etc. happens before the
user reaches the payment step. Cuts down on dead bookings and gives the
user immediate feedback.

Implementation pattern in `handleNext`:
1. Run Formik `validateForm()` — if errors, scroll to first invalid field, snackbar, return.
2. Set local `isStep1Submitting=true`, POST to `/client` with the registration values.
3. Stash returned `_id` on the ref: `registrationValuesRef.current = { ...values, _clientId: response.data?._id }`.
4. Advance to step 2 with `setCurrentStep(1)` + `window.scrollTo({ top: 300, behavior: "smooth" })`.
5. On error, run through `extractBackendError` and snackbar.
6. Always `finally { setIsStep1Submitting(false); }`.

Then in `buildApiBody`, the booking call only references the client id:
```js
const body = { client: regValues._clientId, price, quantity: 1 };
```

Do NOT spread `client: { name, email, ... }` into the booking body anymore —
the client already exists on the backend.

**Don't forget** to add the new endpoint to `src/constants/b2bAPIs.js`:
```js
GRADUATION: {
  STAGES_GRADES: "graduation/stages/grades",
  CLIENT: "graduation/client",     // <-- new
  INITIATION: "graduation/initiation",
  ...
},
```

---

## 3. Scroll to first invalid field

When validation fails on step 1, scrolling to the first error makes the form
feel responsive on mobile (where errors are often offscreen).

a. Wrap each form field in a `<div id="grad-field-<fieldName>">` (or whatever
   prefix matches the event). Naming must match the Formik field name.
   See [GraduationRegistrationStep.jsx](../../src/components/forms/events/graduation/GraduationRegistrationStep.jsx).

b. Define a fixed field order in the form file:
```js
const REGISTRATION_FIELD_ORDER = [
  "name", "academicStage", "classNumber", "phone", "email", "clothesSize",
];
```

c. In `handleNext` after the validation fails branch:
```js
const firstErrorField = REGISTRATION_FIELD_ORDER.find((f) => errors[f]);
if (firstErrorField) {
  const el = document.getElementById(`grad-field-${firstErrorField}`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
}
```

---

## 4. Loading state on step-1 submit button

Before this branch, only the final payment submit had a spinner — clicking
"Next" felt unresponsive while the client API call was in flight.

```jsx
const [isStep1Submitting, setIsStep1Submitting] = useState(false);
// ...
<button
  type="button"
  disabled={isStep1Submitting}
  onClick={() => handleNext(validateForm, setTouched, values)}
  className="... disabled:opacity-60 disabled:cursor-not-allowed"
>
  {isStep1Submitting ? (
    <>
      <CircularProgress size={20} color="inherit" />
      <span>{t("forms.validation.sending")}</span>
    </>
  ) : (
    /* normal label + price */
  )}
</button>
```

---

## 5. Tamara as a payment method

Adding Tamara to an event means three things:

a. **Import** in the payment step file:
```js
import TamaraWidget from "@components/forms/checkout/paymentForm/TamaraWidget";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import tamaraArabic from "@assets/paymentLogos/tamaraArabic.jpg";
import tamaraEnglish from "@assets/paymentLogos/tamaraEnglish.svg";
import { useLocale } from "next-intl";
```

b. **Logo array** keyed on locale:
```js
const tamaraImage = [
  { image: locale === "ar" ? tamaraArabic : tamaraEnglish, name: "tamara" },
];
```

c. **JSX block** — needs `setFieldValue` from Formik passed in via props.
   See [GraduationPaymentStep.jsx](../../src/components/forms/events/graduation/GraduationPaymentStep.jsx)
   for the full block (Tamara widget + phone input wired to
   `paymentValues.tamaraMobile`, country fixed to GCC list).

d. **Container** must be `overflow-hidden max-w-full` because Tamara's script
   injects elements that overflow on small screens. See section 6.

---

## 6. Tamara widget overflow fix (CSS)

The Tamara script injects DOM that ignores parent width and pushes the
viewport horizontally. Fix in `src/app/globals.css`:

```css
.tamara-product-widget-container,
.tamara-product-widget {
  max-width: 100% !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
}

.tamara-product-widget-container * {
  max-width: 100% !important;
  box-sizing: border-box !important;
}
```

And on the wrapper in `TamaraWidget.jsx`:
```jsx
style={{ minHeight: "100px", width: "100%", maxWidth: "100%", overflow: "hidden" }}
```

This is global — any future event using Tamara inherits the fix automatically.

---

## 7. Apple Pay widget — return JSX & error UX

In `GraduationAppleWidget.jsx`:
- Use `useSnackbar()` instead of `alert(...)` for every failure path
  (`onInitiate`, `onComplete`, generate-id, confirm).
- Return a single `<div className="<event>-mysr-form" />` — no extra wrapper
  divs. The Apple SDK targets the class directly; nesting can break it.

---

## 8. Field id naming convention (multi-event)

For an event named, e.g., `summerCamp`, use a short stable prefix on field
container ids: `id="sc-field-<name>"`. Match the prefix to the
`document.getElementById(...)` lookup in `handleNext`. Don't reuse
`grad-field-*` across events — it makes future searches ambiguous.

---

## Quick checklist for a new event form

- [ ] `extractBackendError` helper at top of form file + every widget that calls the API
- [ ] `B2B_END_POINTS.<EVENT>.CLIENT` entry in `src/constants/b2bAPIs.js`
- [ ] Step-1 `handleNext` calls `/client` and stashes returned `_clientId` on the values ref
- [ ] `buildApiBody` references `client: regValues._clientId` only
- [ ] `isStep<n>Submitting` local state + button spinner + disabled state for every step that hits an API
- [ ] Each form field wrapped in `<div id="<event>-field-<name>">`
- [ ] `<EVENT>_FIELD_ORDER` constant + scroll-to-first-error in `handleNext`
- [ ] All `alert(...)` replaced with `enqueueSnackbar(..., { variant: "error" })`
- [ ] If Tamara is offered: wrapper has `overflow-hidden max-w-full`, phone input uses `react-phone-number-input` countries `["SA","AE","BH","KW","OM"]`, `direction: ltr`
- [ ] If Apple Pay is offered: snackbar (not alert) on every failure, single-div widget container
- [ ] Test on real iPhone Safari (Apple Pay) and on a 360px viewport (Tamara overflow)
