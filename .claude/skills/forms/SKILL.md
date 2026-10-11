---
name: forms
description: Use when creating or editing any form — inputs, validation schemas, multi-step forms, submit handling, field errors, or pending/disabled submit state — anywhere in src/components/forms or feature components using Formik/Yup.
---

# Forms in Guestna B2B (Formik + Yup)

## Pieces
- Schema: `src/utils/validators/*.js` (e.g. `validationSchemas.js`, `authSchemas.js`, `checkoutSchemas.js`). Schemas needing translated messages are **factories** taking `t`: `createSchoolTripBookingSchema(t)`.
- Fields: `TextInputGroup`, `DropdownGroup`, `AutocompleteInputGroup`, `PhoneInputGroup`, `CheckboxGroup`, `RadioButtonsGroup`, `FileUploadGroup`, `DynamicFileUpload` in `src/components/forms/`.
- Submit: `@components/ui/FormSubmitButton` (`loading`, `disabled`, `label`).
- Form components live in `src/components/forms/<formName>/`.

## Pattern
```jsx
"use client";
const t = useTranslations();
const schema = useMemo(() => createXSchema(t), [t]);

<Formik initialValues={INITIAL_VALUES} validationSchema={schema} onSubmit={handleSubmit}>
  {({ values, errors, touched, handleChange, handleBlur, isSubmitting, isValid }) => (
    <Form noValidate className="flex flex-col gap-6">
      <TextInputGroup
        name="email" type="email" label={t("forms.email")} required
        value={values.email} onChange={handleChange} onBlur={handleBlur}
        errors={errors.email} touched={touched.email}
      />
      <FormSubmitButton loading={isSubmitting} disabled={!isValid} label={t("forms.submit")} />
    </Form>
  )}
</Formik>
```
- `INITIAL_VALUES` in colocated `constants.js`; every schema field has an initial value (`""`, `[]`, `null`) — never `undefined`.
- Field `name` must equal the schema key and payload mapping. Build API payloads in a pure `buildXPayload(values)` in `utils.js`.
- Use `useFormik` only for small single-file forms; follow whichever style the file already uses.

## Validation messages
- Always translated: `yup.string().required(t("forms.validation.required"))`. Add keys to both `ar.json` and `en.json` under `forms.validation`.
- Phone: reuse `src/utils/phonePatterns.js`; Saudi formats are the default.
- Cross-field rules with `.when()` / `.test()` in the schema, not in `onSubmit`.

## Submit
```js
const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm }) => {
  try {
    await axios.post(getProxyUrl(B2B_END_POINTS.X), buildXPayload(values), { headers: getHeaders(locale) });
    enqueueSnackbar(t("..."), { variant: "success" });
  } catch (err) {
    enqueueSnackbar(extractApiError(err), { variant: "error" });  // map field errors with setFieldError when API returns them
  } finally { setSubmitting(false); }
};
```
- Or `useMutationData` / `useAxiosForm` when the surrounding feature already uses them.
- Pending: `isSubmitting` drives `FormSubmitButton loading`; disable inputs only if resubmission would be harmful.
- Prevent double submits (button disabled while loading) and keep values on error.

## Errors display
- Inline under field via the `errors`/`touched` props (only after touch or submit).
- Server-level errors → snackbar + inline message for critical failures.

## Multi-step forms — copy `forms/schoolTripBookingForm/`
- `STEP_FIELDS` map in `constants.js`; `validateStepFields` / `isStepValid` / `findFirstStepWithErrors` in `stepHelpers.js`.
- "Next" validates only the current step's fields and touches them; final submit jumps to the first step with errors.
- `BookingStepper` + `StepNavigation` for UI.

## Checklist
- [ ] Schema factory with `t`, keys in both locales
- [ ] Labels + `required` markers; correct `type`/`inputMode`/`autoComplete`
- [ ] Payload builder is pure and colocated
- [ ] Success + error feedback, no double submit
