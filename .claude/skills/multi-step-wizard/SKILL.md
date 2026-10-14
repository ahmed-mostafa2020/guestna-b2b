---
name: multi-step-wizard
description: Use when building or changing a multi-step form / wizard / stepper — booking flows, add/edit product, provider register, event registration, student/parent registration — including step validation, next/back navigation, edit-mode prefill, and final submit.
---

# Multi-step wizards in Guestna B2B

Reference implementation: `src/components/forms/schoolTripBookingForm/` (copy its shape).
Other wizards: `addProductForm/` (create + edit), `providerRegisterForm/`, `events/EventRegistrationWizard.jsx`, `registerStudent/`.
Also read the `forms` skill for field/submit basics.

## File layout

```
forms/<wizardName>/
  index.jsx          # one <Formik> wrapping all steps; owns activeStep + submit
  constants.js       # STEPS, STEP_FIELDS, INITIAL_VALUES
  stepHelpers.js     # reuse from schoolTripBookingForm/stepHelpers.js when possible
  utils.js           # pure buildXPayload(values) / mapApiToValues(data)
  steps/<Name>Step.jsx
```

Schema: one factory `createXSchema(t)` in `src/utils/validators/`, covering all steps.

## constants.js

```js
export const X_STEPS = ["details", "contact", "location"]; // → t(`<ns>.steps.${key}`)
export const STEP_FIELDS = [["a", "b"], ["c", "d"], ["e"]]; // index-aligned with X_STEPS
export const INITIAL_VALUES = {
  a: "",
  b: [],
  c: "",
  d: null,
  e: { lat: "", lng: "" },
};
```

Every schema field appears in exactly one `STEP_FIELDS` entry and in `INITIAL_VALUES`.

## Navigation rules

- **Next**: `validateStepFields(step, STEP_FIELDS, formik)`; advance only if valid (it touches the step's fields to show errors).
- **Back**: never validates; keeps values.
- **Step indicator click**: allowed backwards always, forwards only if all previous steps pass `isStepValid`.
- **Final submit**: on errors, `setActiveStep(findFirstStepWithErrors(errors, STEP_FIELDS))`.
- Scroll to top of the form on step change; move focus to the step heading (a11y).
- UI: `BookingStepper` + `StepNavigation` (or the wizard's existing stepper). Disable Next while async step data loads.

## Conditional fields

- Use `.when()` in the schema; hidden fields must not block the step (their rule is `notRequired` when hidden).
- When a toggle hides fields, reset them (`setFieldValue(name, INITIAL_VALUES[name])`) so stale values aren't submitted.

## Edit mode (see `addProductForm/index.jsx`)

- `initialValues = useMemo(() => isEditMode ? mapApiToValues(data) : INITIAL_VALUES, [data])` + `enableReinitialize`.
- Show the skeleton until edit data has loaded — don't mount Formik with empty values and then reinit mid-typing.
- Payload builder takes `isEditMode` (e.g. keep existing gallery URLs, send only removed ids).

## Persistence between visits (only if required)

- Prefer none. If a draft must survive a refresh, use a Redux slice (see `redux-slice` skill) or `sessionStorage` — never persist `File` objects.

## Checklist

- [ ] STEP_FIELDS ↔ schema ↔ INITIAL_VALUES aligned
- [ ] Next validates only the current step; submit jumps to the first bad step
- [ ] Step titles + buttons translated (both locales)
- [ ] Edit mode prefill + skeleton
- [ ] Stepper works in RTL (order, arrows flipped)
