"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { setFinalTripDetailsData } from "@store/checkout/finalTripDetailsSlice";
import { setFirstDayDate, setTripDate } from "@store/checkout/checkoutSlice";
import * as Yup from "yup";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { createRegisterChildSchema } from "@utils/validators/validationSchemas";
import { getHeaders } from "@utils/helpers/getHeaders";
import { cn } from "@utils/helpers/cn";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import getProxyUrl from "@utils/api/getProxyUrl";

import {
  FieldArray,
  Formik,
  setNestedObjectValues,
  useFormikContext,
} from "formik";

import axios from "axios";

import { useSnackbar } from "notistack";

import FormSubmitButton from "@components/ui/FormSubmitButton";
import { Container, Checkbox, FormControlLabel } from "@mui/material";
import ParentFormFields from "./ParentFormFields";
import ChildForm from "./childForms/ChildForm";
import CustomizedRiyadhForm from "./childForms/CustomizedRiyadhForm";
import TermsConfirmationModal from "./TermsConfirmationModal";
import CompanionForm from "./CompanionForm";
import FormSectionHeader from "./FormSectionHeader";
import BookingStepper from "../schoolTripBookingForm/BookingStepper";
import { getGtmTag, GTM_TAGS } from "@utils/tracking/gtmUtils";

const EMPTY_COMPANION = {
  name: "",
  relationship: "",
  age: "",
  nationalId: "",
  nationality: CONSTANT_VALUES.DEFAULT_NATIONALITY_ID,
};

// Formik fields validated before leaving each step
const STEP_FIELDS = {
  parent: [
    "parentName",
    "relationship",
    "email",
    "mobile",
    "nationality",
    "childrenNumber",
    "duration",
    "bookingDay",
  ],
  students: ["children"],
  companions: ["companions"],
};

const STORAGE_KEY_PREFIX = "registerStudentForm";

// Saves the entered values to localStorage so they survive a page refresh
// (files can't be serialized, so uploaded images are left out)
const FormPersist = ({ storageKey, enabled, termsAccepted, currentStep }) => {
  const { values } = useFormikContext();

  useEffect(() => {
    if (!enabled || !storageKey) return;
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            values: {
              ...values,
              children: values.children.map(
                // eslint-disable-next-line no-unused-vars
                ({ nationalIdImage, ...child }) => child
              ),
            },
            termsAccepted,
            currentStep,
          })
        );
      } catch {
        // Storage unavailable (private mode / quota) → skip persisting
      }
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [enabled, storageKey, values, termsAccepted, currentStep]);

  return null;
};

// Drop the entry at `idx` from an index-keyed object and shift the rest down
const removeIndexedKey = (obj, idx) =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([key]) => Number(key) !== idx)
      .map(([key, value]) => [
        Number(key) > idx ? Number(key) - 1 : Number(key),
        value,
      ])
  );

const checkboxLabelSx = {
  alignItems: "flex-start",
  margin: 0,
  width: "100%",
  "& .MuiFormControlLabel-label": {
    color: "var(--color-text-dark)",
    fontSize: "14px",
    lineHeight: 1.6,
    fontFamily: "var(--font-somar-sans), sans-serif",
  },
};

const checkboxSx = {
  padding: "4px",
  marginTop: "-4px",
  color: "var(--color-text-dark)",
  "& .MuiSvgIcon-root": { fontSize: 24 },
  "&.Mui-checked": {
    color: "var(--color-title)",
  },
};

const RegisterStudentForm = ({
  tripMainCategory,
  availableSeats,
  termsData,
}) => {
  const [_, setNationalityError] = useState("");
  const [__, setStageError] = useState("");
  const [___, setGradeError] = useState("");

  const [childrenNumber, setChildrenNumber] = useState(1);
  const [nationality, setNationality] = useState(
    CONSTANT_VALUES.DEFAULT_NATIONALITY_ID
  );
  const [nationalIdImage, setNationalIdImage] = useState(null);
  const [nationalIdImageError, setNationalIdImageError] = useState("");

  const [childrenStages, setChildrenStages] = useState({});
  const [gradesList, setGradesList] = useState({});
  const [gradesLoading, setGradesLoading] = useState({});
  const [childrenNationalIdImages, setChildrenNationalIdImages] = useState([]); // array of files
  const [childrenNationalIdImagesError, setChildrenNationalIdImagesError] =
    useState([]);
  const [childrenClasses, setChildrenClasses] = useState({});

  // Terms confirmation state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  // Saving starts only after the stored draft (if any) has been restored
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // Father as parent → the student name is auto-completed with the father's name
  const isFatherParent = (relationship) =>
    relationship === t("forms.registerForm.parentRelationshipOptions.father");

  const parentEmail = useSelector(
    (state) => state.parentLoginForm.parentData?.email
  );
  const parentPhone = useSelector(
    (state) => state.parentLoginForm.parentData?.phone
  );

  const [formErrors, setFormErrors] = useState([]);

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  const dispatch = useDispatch();

  const headers = getHeaders(locale, true);
  const headersGetMethod = getHeaders(locale);

  const { nationalities, trip } = useSelector(
    (state) => state.tripDetailsData.data
  );

  const tripClasses = useSelector(
    (state) => state.tripDetailsData.data?.trip?.classes
  );

  const academicStages = useSelector(
    (state) => state.tripDetailsData.data?.trip?.academicStages
  );

  const educationSystem = useSelector(
    (state) => state.tripDetailsData.data?.trip?.educationSystem
  );

  const formsType = useSelector(
    (state) => state.tripDetailsData.data?.trip?.categories?.formsType
  );

  const isSharedWithCompanions = useSelector(
    (state) => !!state.tripDetailsData.data?.trip?.isSharedWithCompanions
  );

  const tripId = useSelector((state) => state.tripDetailsData.data?.trip?._id);
  const tripName = useSelector(
    (state) => state.tripDetailsData.data?.trip?.name
  );
  const dayBlockPricing = useSelector(
    (state) => state.tripDetailsData.data?.trip?.dayBlockPricing
  );
  const tripDuration = useSelector(
    (state) => state.tripDetailsData.data?.trip?.duration
  );
  const tripPrice = useSelector(
    (state) =>
      state.tripDetailsData.data?.trip?.discountedPrice ??
      state.tripDetailsData.data?.trip?.price
  );
  const firstAvailableDate = useSelector((state) => {
    const trip = state.tripDetailsData.data?.trip;
    if (trip?.day) return trip.day;
    const bookingDays = trip?.bookingDay;
    if (bookingDays && bookingDays.length > 0) {
      return bookingDays[0]?.bookingDay;
    }
    return null;
  });

  const registerChildSchema = useMemo(() => {
    let schema = createRegisterChildSchema(t, childrenNumber, tripMainCategory);
    if (dayBlockPricing?.enabled && firstAvailableDate) {
      const datePart = firstAvailableDate.split("T")[0];
      const parts = datePart.split("-");
      const minLimit = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
      const maxLimit = new Date(
        minLimit.getTime() + tripDuration * 24 * 60 * 60 * 1000
      );

      schema = schema.concat(
        Yup.object().shape({
          fullDuration: Yup.boolean().default(true),
          bookingDay: Yup.date()
            .transform((value, originalValue) =>
              originalValue === "" || originalValue === null ? undefined : value
            )
            .required(t("forms.validation.require"))
            .typeError(t("forms.validation.invalidDate") || "Invalid date")
            .min(
              minLimit,
              t("forms.validation.minDate") || "Date is before available start"
            )
            .max(
              maxLimit,
              t("forms.validation.maxDate") || "Date is after available end"
            ),
          duration: Yup.number()
            .nullable()
            .typeError(t("forms.validation.require"))
            .when("fullDuration", {
              is: (val) => val === false,
              then: (s) => s.required(t("forms.validation.require")),
              otherwise: (s) => s.notRequired(),
            }),
        })
      );
    }
    return schema;
  }, [
    childrenNumber,
    t,
    tripMainCategory,
    dayBlockPricing,
    firstAvailableDate,
    tripDuration,
  ]);

  const formikRef = useRef(null);
  // Cache grades requests per URL so children sharing a stage reuse one request
  const gradesCacheRef = useRef({});
  useEffect(() => {
    const isDayBlockEnabled =
      dayBlockPricing?.enabled === true && tripDuration > 0;
    if (!isDayBlockEnabled || !formikRef.current) return;

    const { values, setFieldValue } = formikRef.current;
    if ((values.fullDuration ?? true) && values.duration !== tripDuration) {
      setFieldValue("duration", tripDuration);
    }
  }, [dayBlockPricing, tripDuration]);

  const { enqueueSnackbar } = useSnackbar();

  const generateInitialChildren = (count) => {
    return Array.from({ length: count }, () => {
      const child = {
        studentName: "",
        academicStage: "",
        grade: "",
        class: "",
        nationalId: "",
        studentMobile: "",
        studentEmail: "",
        note: "",
        ...((tripMainCategory ===
          CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH ||
          tripMainCategory ===
            CONSTANT_VALUES.MAIN_CATEGORIES.RIYADH_VIBES) && {
          nationalIdImage:
            tripMainCategory === CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH
              ? null
              : undefined,
        }),
      };
      return child;
    });
  };

  // Fetch the grades of a stage for one child (requests are cached per URL)
  const fetchChildGrades = async (childIndex, stage) => {
    setGradesLoading((prev) => ({
      ...prev,
      [childIndex]: true,
    }));

    const gradesUrl = getProxyUrl(
      `${B2B_END_POINTS.STUDENTS_GRADES}/${tripId}/${stage}/${educationSystem}`
    );
    try {
      if (!gradesCacheRef.current[gradesUrl]) {
        gradesCacheRef.current[gradesUrl] = axios
          .get(gradesUrl, { headers: headersGetMethod })
          .then((res) => res.data)
          .catch((err) => {
            delete gradesCacheRef.current[gradesUrl];
            throw err;
          });
      }
      const grades = await gradesCacheRef.current[gradesUrl];
      setGradesList((prev) => ({
        ...prev,
        [childIndex]: grades,
      }));
    } catch (error) {
      setGradesList((prev) => ({
        ...prev,
        [childIndex]: [],
      }));
    } finally {
      setGradesLoading((prev) => ({
        ...prev,
        [childIndex]: false,
      }));
    }
  };

  const storageKey = tripId ? `${STORAGE_KEY_PREFIX}:${tripId}` : null;

  // Restore the draft saved before a refresh
  useEffect(() => {
    if (!storageKey || !formikRef.current) return;

    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(storageKey));
    } catch {
      saved = null;
    }

    if (saved?.values) {
      const [emptyChild] = generateInitialChildren(1);
      const children = (
        saved.values.children?.length ? saved.values.children : [{}]
      ).map((child) => ({ ...emptyChild, ...child }));
      const companions = Array.isArray(saved.values.companions)
        ? saved.values.companions
        : [];
      const withCompanions =
        isSharedWithCompanions &&
        !!saved.values.withCompanions &&
        companions.length > 0;

      const restoredValues = {
        ...formikRef.current.values,
        ...saved.values,
        children,
        childrenNumber: children.length,
        withCompanions,
        companions: withCompanions ? companions : [],
      };
      // Validate so isValid reflects the restored draft, not the empty form
      formikRef.current.setValues(restoredValues);

      setChildrenNumber(children.length);
      setNationality(
        restoredValues.nationality || CONSTANT_VALUES.DEFAULT_NATIONALITY_ID
      );

      const stages = {};
      const classes = {};
      children.forEach((child, idx) => {
        stages[idx] = child.academicStage || "";
        if (child.class) classes[idx] = child.class;
      });
      setChildrenStages(stages);
      setChildrenClasses(classes);

      setTermsAccepted(!!saved.termsAccepted);
      const lastStep = withCompanions ? 2 : 1;
      setCurrentStep(Math.min(Number(saved.currentStep) || 0, lastStep));
    }

    setIsDraftRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Re-validate once the restored values and children count are in place
  useEffect(() => {
    if (isDraftRestored) formikRef.current?.validateForm();
  }, [isDraftRestored]);

  // Load grades for restored stages once the trip's education system is known
  // (the grades URL needs it, and it may arrive after the draft is restored)
  useEffect(() => {
    if (!isDraftRestored || !educationSystem) return;
    formikRef.current?.values.children.forEach((child, idx) => {
      if (child.academicStage) fetchChildGrades(idx, child.academicStage);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDraftRestored, educationSystem]);

  const seatsArray = useMemo(() => {
    return Array.from({ length: availableSeats }, (_, i) => ({
      _id: i + 1,
      name: String(i + 1),
      value: i + 1,
    }));
  }, [availableSeats]);

  const childrenNumberList = useMemo(() => {
    return availableSeats < 9
      ? seatsArray
      : [
          { _id: 1, name: "1", value: 1 },
          { _id: 2, name: "2", value: 2 },
          { _id: 3, name: "3", value: 3 },
          { _id: 4, name: "4", value: 4 },
          { _id: 5, name: "5", value: 5 },
          { _id: 6, name: "6", value: 6 },
          { _id: 7, name: "7", value: 7 },
          { _id: 8, name: "8", value: 8 },
          { _id: 9, name: "9", value: 9 },
        ];
  }, [availableSeats, seatsArray]);

  // Companions share the trip seats with the children
  const maxCompanions = Math.max(
    0,
    Math.min(9, (availableSeats || 0) - childrenNumber)
  );

  // Validate custom fields
  const validateCustomFields = (values) => {
    let isValid = true;

    // Validate stages
    if (!childrenStages || Object.values(childrenStages).some((v) => !v)) {
      setStageError(t("forms.validation.require"));
      isValid = false;
    } else {
      setStageError("");
    }

    // Validate grades
    if (values.children.some((child) => !child.grade)) {
      setGradeError(t("forms.validation.require"));
      isValid = false;
    } else {
      setGradeError("");
    }

    // Validate classes (required only when tripClasses exists)
    if (tripClasses && tripClasses.length > 0) {
      if (values.children.some((_, idx) => !childrenClasses[idx])) {
        isValid = false;
      }
    }

    // Validate nationality
    if (!nationality) {
      setNationalityError(t("forms.validation.require"));
      isValid = false;
    } else {
      setNationalityError("");
    }

    // parent - file upload is now optional
    setNationalIdImageError("");

    // children - file uploads are now optional
    const errors = [];
    values.children.forEach((child, idx) => {
      errors[idx] = "";
    });
    setChildrenNationalIdImagesError(errors);

    return isValid;
  };

  const handleSubmit = (
    values,
    {
      setSubmitting,
      // , resetForm
    }
  ) => {
    // Validate custom fields before submission
    if (!validateCustomFields(values)) {
      setSubmitting(false);
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("formsType", tripMainCategory);
    formData.append("name", values.parentName);
    const companions =
      isSharedWithCompanions && values.withCompanions ? values.companions : [];
    // Total seats = children + companions
    formData.append("quantity", values.childrenNumber + companions.length);
    if (values.relationship) {
      formData.append("relationship", values.relationship);
    }
    formData.append("phone", values.mobile);
    if (values.backupMobile) {
      formData.append("backupPhone", values.backupMobile);
    }
    formData.append("email", values.email);
    formData.append("nationality", nationality);
    if (values.nationalId) {
      formData.append("nationalId", values.nationalId);
    }
    if (nationalIdImage) {
      formData.append("nationalIdImage", nationalIdImage);
    }
    formData.append("trip", tripId);
    // formData.append("formsType", formsType);
    if (values.promoCode) formData.append("promoCode", values.promoCode);
    if (values.duration) {
      formData.append("duration", values.duration);
    }
    if (values.bookingDay) {
      formData.append("bookingDay", values.bookingDay);
      dispatch(setFirstDayDate(values.bookingDay));
      dispatch(setTripDate(values.bookingDay));
    }
    formData.append("termsAccepted", termsAccepted ? "true" : "false");
    if (termsData?._id) {
      formData.append("termsAndCondition", termsData._id);
    }

    // Append each child as a nested object
    values.children.forEach((child, idx) => {
      formData.append(`childs[${idx}].name`, child.studentName.trim());
      if (child.nationalId) {
        formData.append(`childs[${idx}].nationalId`, `${child.nationalId}`);
      }

      if (childrenNationalIdImages[idx]) {
        formData.append(
          `childs[${idx}].nationalIdImage`,
          childrenNationalIdImages[idx]
        );
      }

      formData.append(`childs[${idx}].academicStage`, child.academicStage);
      formData.append(`childs[${idx}].grade`, child.grade);

      // Append selected class if available
      const selectedClass = childrenClasses[idx] || child.class;
      if (selectedClass) {
        formData.append(`childs[${idx}].class`, selectedClass);
      }

      formData.append(`childs[${idx}].formsType`, formsType);

      if (child.studentMobile)
        formData.append(`childs[${idx}].phone`, child.studentMobile);
      if (child.studentEmail)
        formData.append(`childs[${idx}].email`, child.studentEmail);
      if (child.note?.trim())
        formData.append(`childs[${idx}].note`, child.note.trim());
    });

    companions.forEach((companion, idx) => {
      formData.append(
        `companions[${idx}].relationship`,
        companion.relationship
      );
      formData.append(`companions[${idx}].name`, companion.name.trim());
      if (companion.age !== "" && companion.age != null)
        formData.append(`companions[${idx}].age`, companion.age);
      if (companion.nationalId)
        formData.append(`companions[${idx}].nationalId`, companion.nationalId);
      if (companion.nationality)
        formData.append(
          `companions[${idx}].nationality`,
          companion.nationality
        );
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      // url: `${B2B_END_POINTS.SECURE_MAIN}${B2B_END_POINTS.STUDENT_REGISTER}`,
      url: getProxyUrl(B2B_END_POINTS.STUDENT_REGISTER),

      headers,
      data: formData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        // resetForm();

        // Booking sent → the saved draft is no longer needed
        try {
          if (storageKey) localStorage.removeItem(storageKey);
        } catch {
          // ignore storage errors
        }

        // Change acc to response
        if (response && response.data) {
          // Validate response data structure before dispatching
          if (!response.data.slug) {
            console.error(
              "WARNING: Response missing slug field",
              response.data
            );
          }
          if (!response.data.name) {
            console.error(
              "WARNING: Response missing name field",
              response.data
            );
          }

          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });

          dispatch(setFinalTripDetailsData(response.data));

          // Add small delay before navigation to ensure Redux state is updated
          setTimeout(() => {
            router.push(`/${locale}/checkout`);
          }, 100);
        } else {
          console.error("Invalid response structure:", response);
          enqueueSnackbar(
            t("forms.validation.error") || "Invalid response from server",
            {
              variant: "error",
            }
          );
        }
      })

      .catch((error) => {
        setSubmitting(false);

        console.error("Registration error:", {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });

        const errorMessage = getErrorMessage(error, t);

        enqueueSnackbar(errorMessage, {
          variant: "error",
        });

        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  return (
    <Container maxWidth="lg" id="register-student-form">
      <div className="my-6 border-b border-black lg:my-12"></div>
      <h3 className="pb-6 text-lg font-semibold text-titleColor lg:text-2xl lg:pb-12">
        {t("forms.registerForm.title")}
      </h3>
      <Formik
        innerRef={formikRef}
        initialValues={{
          parentName: "",
          childrenNumber: childrenNumber,
          relationship: "",
          mobile: parentPhone || "",
          backupMobile: "",
          email: parentEmail || "",
          nationality: CONSTANT_VALUES.DEFAULT_NATIONALITY_ID,
          nationalId: "",
          promoCode: "",
          duration: tripDuration || null,
          fullDuration: true,
          bookingDay: "",
          children: generateInitialChildren(childrenNumber),
          withCompanions: false,
          companions: [],
        }}
        validationSchema={registerChildSchema}
        onSubmit={handleSubmit}
        enableReinitialize={false}
        validateOnBlur={true}
        validateOnChange={true}
        validateOnMount={true}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          isSubmitting,
          validateForm,
          setFieldTouched,
          setTouched,
          setValues,
        }) => {
          const hasCompanions =
            isSharedWithCompanions &&
            values.withCompanions &&
            values.companions.length > 0;
          const canAddCompanion = values.companions.length < maxCompanions;
          const steps = [
            "parent",
            "students",
            ...(hasCompanions ? ["companions"] : []),
          ];
          const lastFormStep = steps.length - 1;
          const stepKey = steps[currentStep];
          const isLastFormStep = currentStep === lastFormStep;
          const canAddChild = childrenNumber < childrenNumberList.length;

          const fatherName = isFatherParent(values.relationship)
            ? values.parentName.trim()
            : "";

          // Lets the stepper unlock the next step once the current one passes validation
          const isCurrentStepValid =
            (STEP_FIELDS[stepKey] || []).every((field) => !errors[field]) &&
            (stepKey !== "parent" || termsAccepted);

          const scrollToForm = () =>
            document
              .getElementById("register-student-form")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });

          const goToStep = (step) => {
            setCurrentStep(step);
            scrollToForm();
          };

          const goToNextStep = async () => {
            const allErrors = await validateForm();
            const stepErrors = Object.fromEntries(
              (STEP_FIELDS[stepKey] || [])
                .filter((field) => allErrors[field])
                .map((field) => [field, allErrors[field]])
            );

            if (Object.keys(stepErrors).length > 0) {
              setTouched(
                { ...touched, ...setNestedObjectValues(stepErrors, true) },
                false
              );
              return;
            }

            if (stepKey === "parent" && !termsAccepted) return;
            if (stepKey === "students" && !validateCustomFields(values)) return;

            goToStep(currentStep + 1);
          };

          const handleFormSubmit = (event) => {
            // Enter key on an intermediate step moves forward instead of submitting
            if (!isLastFormStep) {
              event.preventDefault();
              goToNextStep();
              return;
            }
            handleSubmit(event);
          };

          // Checkbox under the students → adds/removes the companions step
          const handleToggleCompanions = (checked) => {
            setFieldValue("withCompanions", checked);
            setFieldValue(
              "companions",
              checked
                ? values.companions.length
                  ? values.companions
                  : [{ ...EMPTY_COMPANION }]
                : []
            );
          };

          const handleAddCompanion = () => {
            setFieldValue("companions", [
              ...values.companions,
              { ...EMPTY_COMPANION },
            ]);
          };

          const handleRemoveChild = (index, remove) => {
            const newCount = childrenNumber - 1;
            remove(index);
            setChildrenNumber(newCount);
            setFieldValue("childrenNumber", newCount);
            setChildrenStages((prev) => removeIndexedKey(prev, index));
            setGradesList((prev) => removeIndexedKey(prev, index));
            setGradesLoading((prev) => removeIndexedKey(prev, index));
            setChildrenClasses((prev) => removeIndexedKey(prev, index));
            setChildrenNationalIdImages((prev) =>
              prev.filter((_, i) => i !== index)
            );
            setChildrenNationalIdImagesError((prev) =>
              prev.filter((_, i) => i !== index)
            );
          };

          const handleRemoveCompanion = (index, remove) => {
            const newCount = values.companions.length - 1;
            // No companions left → the companions step disappears.
            // Single setValues so validation runs on the final values
            // (remove + setFieldValue raced and left a stale companions error)
            if (newCount === 0) {
              setValues({ ...values, withCompanions: false, companions: [] });
              goToStep(steps.indexOf("students"));
              return;
            }
            remove(index);
          };

          // Define handlers inside the Formik render function
          const handleChangeChildClasses = (childIndex, event) => {
            const selectedClass = event.target.value;
            setChildrenClasses((prev) => ({
              ...prev,
              [childIndex]: selectedClass,
            }));
            setFieldValue(`children[${childIndex}].class`, selectedClass);
          };

          const handleChangeChildrenNumber = (event) => {
            const newCount = parseInt(event.target.value);
            setChildrenNumber(newCount);

            // Preserve existing children data
            let updatedChildren = [...values.children];

            if (updatedChildren.length < newCount) {
              // Add empty children if increasing
              for (let i = updatedChildren.length; i < newCount; i++) {
                const newChild = {
                  studentName: "",
                  academicStage: "",
                  grade: "",
                  class: "",
                  nationalId: "",
                  studentMobile: "",
                  studentEmail: "",
                  note: "",
                  ...((tripMainCategory ===
                    CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH ||
                    tripMainCategory ===
                      CONSTANT_VALUES.MAIN_CATEGORIES.RIYADH_VIBES) && {
                    nationalIdImage:
                      tripMainCategory ===
                      CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH
                        ? null
                        : undefined,
                  }),
                };

                updatedChildren.push(newChild);
              }
            } else if (updatedChildren.length > newCount) {
              // Remove extra children if decreasing
              updatedChildren = updatedChildren.slice(0, newCount);
            }

            // Update form values
            setFieldValue("children", updatedChildren);
            setFieldValue("childrenNumber", newCount);

            // Keep children + companions within the available seats
            const companionsLimit = Math.max(
              0,
              Math.min(9, (availableSeats || 0) - newCount)
            );
            if (values.companions.length > companionsLimit) {
              setFieldValue(
                "companions",
                values.companions.slice(0, companionsLimit)
              );
              if (companionsLimit === 0) setFieldValue("withCompanions", false);
            }

            // Reset stages for new children count
            const newStages = {};
            for (let i = 0; i < newCount; i++) {
              newStages[i] = childrenStages[i] || "";
            }
            setChildrenStages(newStages);

            // Trigger Formik validation to refresh isValid based on current values
            validateForm();
          };

          const handleChangeNationality = (event) => {
            setNationality(event.target.value);
            setFieldValue("nationality", event.target.value);
          };

          const handleChangeChildStage = async (childIndex, event) => {
            const newStage = event.target.value;
            setChildrenStages((prev) => ({
              ...prev,
              [childIndex]: newStage,
            }));
            setFieldValue(`children[${childIndex}].academicStage`, newStage);

            // Fetch grades for the selected stage
            await fetchChildGrades(childIndex, newStage);
          };

          const handleChangeChildGrade = (childIndex, event) => {
            const newGrade = event.target.value;
            setFieldValue(`children[${childIndex}].grade`, newGrade);

            // Reset selected class when grade changes
            setChildrenClasses((prev) => ({
              ...prev,
              [childIndex]: "",
            }));
            setFieldValue(`children[${childIndex}].class`, "");
          };

          return (
            <form
              onSubmit={handleFormSubmit}
              id="register-student-form"
              className="flex flex-col gap-8 px-4 py-8 bg-white shadow-sm rounded-xl sm:px-8 lg:py-12"
            >
              <FormPersist
                storageKey={storageKey}
                enabled={isDraftRestored}
                termsAccepted={termsAccepted}
                currentStep={currentStep}
              />

              <BookingStepper
                namespace="forms.registerForm.steps"
                steps={steps}
                currentStep={currentStep}
                isCurrentStepValid={isCurrentStepValid}
                onStepClick={(step) => {
                  if (step < currentStep) goToStep(step);
                  else if (step === currentStep + 1) goToNextStep();
                }}
              />

              {stepKey === "parent" && (
                <div className="flex flex-col gap-5">
                  <FormSectionHeader
                    title={t("forms.registerForm.parentSection.title")}
                    subtitle={t("forms.registerForm.parentSection.subtitle")}
                  />
                  <ParentFormFields
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    handleChangeNationality={(event) =>
                      handleChangeNationality(event, setFieldValue)
                    }
                    setNationalIdImage={setNationalIdImage}
                    nationalIdImageError={nationalIdImageError}
                    setNationalIdImageError={setNationalIdImageError}
                    nationalities={nationalities}
                    dayBlockPricing={dayBlockPricing}
                    tripDuration={tripDuration}
                    tripPrice={tripPrice}
                    firstAvailableDate={firstAvailableDate}
                    t={t}
                    cn={cn}
                  />
                </div>
              )}

              {/* Dynamic Children Fields */}
              {/* tripMainCategory ===
              CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH */}

              {stepKey === "students" && (
                <FieldArray
                  name="children"
                  className="transition-all duration-200 ease-in-out"
                >
                  {/* eslint-disable-next-line no-unused-vars */}
                  {({ push, remove }) => (
                    <div className="flex flex-col gap-10">
                      {values.children.map((child, index) => {
                        const onRemove =
                          childrenNumber > 1
                            ? () => handleRemoveChild(index, remove)
                            : undefined;
                        return tripMainCategory ===
                          CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH ||
                          tripMainCategory ===
                            CONSTANT_VALUES.MAIN_CATEGORIES.RIYADH_VIBES ? (
                          <CustomizedRiyadhForm
                            key={`child-${index}`}
                            child={child}
                            index={index}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            childrenStages={childrenStages}
                            academicStages={academicStages}
                            handleChangeChildStage={handleChangeChildStage}
                            gradesList={gradesList[index] || []}
                            gradesLoading={gradesLoading[index] || false}
                            handleChangeChildGrade={handleChangeChildGrade}
                            tripClasses={tripClasses}
                            childrenClasses={childrenClasses}
                            handleChangeChildClasses={handleChangeChildClasses}
                            onChildImageChange={(file) => {
                              const updated = [...childrenNationalIdImages];
                              updated[index] = file;
                              setChildrenNationalIdImages(updated);

                              // Clear error for this child on new file
                              setChildrenNationalIdImagesError((prev) => {
                                const arr = [...prev];
                                arr[index] = "";
                                return arr;
                              });
                            }}
                            onNationalIdImageChange={(file) => {
                              const updated = [...childrenNationalIdImages];
                              updated[index] = file;
                              setChildrenNationalIdImages(updated);

                              // Clear error for this child on new file
                              setChildrenNationalIdImagesError((prev) => {
                                const arr = [...prev];
                                arr[index] = "";
                                return arr;
                              });
                            }}
                            imageError={childrenNationalIdImagesError[index]}
                            nationalIdImageError={
                              childrenNationalIdImagesError[index]
                            }
                            t={t}
                            cn={cn}
                            childrenNumber={childrenNumber}
                            fatherName={fatherName}
                            tripMainCategory={tripMainCategory}
                            onRemove={onRemove}
                          />
                        ) : (
                          <ChildForm
                            key={`child-${index}`}
                            child={child}
                            index={index}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            childrenStages={childrenStages}
                            academicStages={academicStages}
                            handleChangeChildStage={handleChangeChildStage}
                            gradesList={gradesList[index] || []}
                            gradesLoading={gradesLoading[index] || false}
                            handleChangeChildGrade={handleChangeChildGrade}
                            tripClasses={tripClasses}
                            childrenClasses={childrenClasses}
                            handleChangeChildClasses={handleChangeChildClasses}
                            onChildImageChange={(file) => {
                              const updated = [...childrenNationalIdImages];
                              updated[index] = file;
                              setChildrenNationalIdImages(updated);

                              // Set only the file name in Formik values
                              setFieldValue(
                                `children[${index}].nationalIdImage`,
                                file ? file.name : null
                              );

                              // Clear error for this child on new file
                              setChildrenNationalIdImagesError((prev) => {
                                const arr = [...prev];
                                arr[index] = "";
                                return arr;
                              });
                            }}
                            imageError={childrenNationalIdImagesError[index]}
                            t={t}
                            cn={cn}
                            childrenNumber={childrenNumber}
                            fatherName={fatherName}
                            onRemove={onRemove}
                          />
                        );
                      })}
                    </div>
                  )}
                </FieldArray>
              )}

              {/* Opt-in for relative companions → adds the companions step */}
              {stepKey === "students" &&
                isSharedWithCompanions &&
                (maxCompanions > 0 || values.withCompanions) && (
                  <div className="p-4 bg-noticeBg rounded-xl">
                    <FormControlLabel
                      sx={checkboxLabelSx}
                      control={
                        <Checkbox
                          checked={!!values.withCompanions}
                          onChange={(e) =>
                            handleToggleCompanions(e.target.checked)
                          }
                          sx={checkboxSx}
                        />
                      }
                      label={
                        <span className="font-semibold">
                          {t("forms.registerForm.companions.toggleLabel")}
                        </span>
                      }
                    />
                  </div>
                )}

              {stepKey === "companions" && (
                <div className="flex flex-col gap-5">
                  <FormSectionHeader
                    title={t("forms.registerForm.companions.title")}
                    subtitle={t("forms.registerForm.companions.subtitle")}
                  />
                  <FieldArray name="companions">
                    {({ remove }) => (
                      <div className="flex flex-col gap-10">
                        {values.companions.map((companion, index) => (
                          <CompanionForm
                            key={`companion-${index}`}
                            companion={companion}
                            index={index}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            nationalities={nationalities}
                            showNationalId={
                              tripMainCategory ===
                                CONSTANT_VALUES.MAIN_CATEGORIES
                                  .OUTSIDE_RIYADH ||
                              tripMainCategory ===
                                CONSTANT_VALUES.MAIN_CATEGORIES.RIYADH_VIBES
                            }
                            onRemove={() =>
                              handleRemoveCompanion(index, remove)
                            }
                            t={t}
                          />
                        ))}
                      </div>
                    )}
                  </FieldArray>
                </div>
              )}

              {/* Parent responsibility + terms confirmation */}
              {stepKey === "parent" && (
                <div className="p-4 bg-noticeBg rounded-xl">
                  <FormControlLabel
                    sx={checkboxLabelSx}
                    control={
                      <Checkbox
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        sx={checkboxSx}
                      />
                    }
                    label={
                      <span className="font-semibold">
                        {t("forms.registerForm.parentResponsibleConfirm")}{" "}
                        <button
                          type="button"
                          onClick={() => setTermsModalOpen(true)}
                          className="text-mainColor underline hover:text-linksHover font-semibold transition-colors"
                        >
                          {t("forms.registerForm.parentTermsLinkText")}
                        </button>
                      </span>
                    }
                  />
                </div>
              )}

              {/* Step actions */}
              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:gap-9">
                {stepKey === "students" && canAddChild && (
                  <button
                    type="button"
                    onClick={() =>
                      handleChangeChildrenNumber({
                        target: { value: childrenNumber + 1 },
                      })
                    }
                    className="flex-1 py-3 font-bold text-center transition-all duration-200 ease-in-out bg-white border-2 rounded-lg font-somar border-secColor text-mainColor hover:bg-secColor hover:text-white"
                  >
                    {t("forms.registerForm.actions.addStudent")}
                  </button>
                )}

                {stepKey === "companions" && canAddCompanion && (
                  <button
                    type="button"
                    onClick={handleAddCompanion}
                    className="flex-1 py-3 font-bold text-center transition-all duration-200 ease-in-out bg-white border-2 rounded-lg font-somar border-secColor text-mainColor hover:bg-secColor hover:text-white"
                  >
                    {t("forms.registerForm.actions.addCompanion")}
                  </button>
                )}

                {isLastFormStep ? (
                  <FormSubmitButton
                    {...getGtmTag(
                      GTM_TAGS.PAYMENT.REGISTER_STUDENT_CONTINUE,
                      "payment"
                    )}
                    loading={isSubmitting}
                    disabled={
                      !isValid ||
                      !nationality ||
                      !termsAccepted ||
                      Object.values(childrenStages).some((v) => !v) ||
                      values.children.some((child) => !child.grade) ||
                      (tripClasses?.length > 0 &&
                        values.children.some((_, idx) => !childrenClasses[idx]))
                    }
                    label={t("links.continuePayment")}
                    isValid={
                      isValid &&
                      !!nationality &&
                      !!termsAccepted &&
                      !Object.values(childrenStages).some((v) => !v) &&
                      !values.children.some((child) => !child.grade) &&
                      !(
                        tripClasses?.length > 0 &&
                        values.children.some((_, idx) => !childrenClasses[idx])
                      )
                    }
                    className="flex-1 !mt-0 py-3 text-base font-bold font-somar"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={goToNextStep}
                    disabled={stepKey === "parent" && !termsAccepted}
                    className="flex-1 py-3 font-bold text-white transition-all duration-200 ease-in-out border-2 rounded-lg font-somar border-mainColor bg-mainColor hover:bg-linksHover hover:border-linksHover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("forms.registerForm.actions.next")}
                  </button>
                )}
              </div>

              {/* Terms Confirmation Modal */}
              <TermsConfirmationModal
                open={termsModalOpen}
                onClose={() => setTermsModalOpen(false)}
                students={values.children.map((child, idx) => ({
                  name: child.studentName,
                  academicStage:
                    academicStages?.find(
                      (stage) => stage._id === childrenStages[idx]
                    )?.name || "",
                  grade:
                    gradesList[idx]?.find((g) => g._id === child.grade)?.name ||
                    "",
                }))}
                schoolName={trip?.organization?.name}
                isChecked={termsAccepted}
                onCheckChange={(checked) => {
                  setTermsAccepted(checked);
                  if (checked) setTermsModalOpen(false);
                }}
                parentName={values.parentName}
                tripName={tripName}
                termsData={termsData}
                t={t}
              />
            </form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default memo(RegisterStudentForm);
