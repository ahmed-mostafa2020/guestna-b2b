"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { setFinalTripDetailsData } from "@store/checkout/finalTripDetailsSlice";

import { useMemo, useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { createRegisterChildSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import { cn } from "@utils/cn";
import getErrorMessage from "@utils/getErrorMessage ";

import { FieldArray, Formik } from "formik";

import axios from "axios";

import { useSnackbar } from "notistack";

import { CircularProgress, Container } from "@mui/material";
import ParentFormFields from "./ParentFormFields";
import ChildForm from "./ChildForm";

const RegisterStudentForm = () => {
  const [_, setNationalityError] = useState("");
  const [__, setStageError] = useState("");
  const [___, setGradeError] = useState("");

  const [childrenNumber, setChildrenNumber] = useState(1);
  const [nationality, setNationality] = useState("");
  const [nationalIdImage, setNationalIdImage] = useState(null);
  const [nationalIdImageError, setNationalIdImageError] = useState("");

  const [childrenStages, setChildrenStages] = useState({});
  const [gradesList, setGradesList] = useState({});

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

  const registerChildSchema = useMemo(() => {
    return createRegisterChildSchema(t, childrenNumber);
  }, [childrenNumber, t]);

  const { academicStages, nationalities } = useSelector(
    (state) => state.tripDetailsData.data
  );

  const educationSystem = useSelector(
    (state) => state.tripDetailsData.data?.trip?.educationSystem
  );

  const formsType = useSelector(
    (state) => state.tripDetailsData.data?.trip?.categories?.formsType
  );

  const tripId = useSelector((state) => state.tripDetailsData.data?.trip?._id);

  const { enqueueSnackbar } = useSnackbar();

  // Helper function to generate initial children array
  const generateInitialChildren = (count) => {
    return Array.from({ length: count }, () => ({
      studentName: "",
      academicStage: "",
      grade: "",
      nationalId: "",
      studentMobile: "",
      studentEmail: "",
    }));
  };

  const childrenNumberList = [
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

  // Validate custom fields
  const validateCustomFields = (values) => {
    let isValid = true;

    // Validate stages
    if (!childrenStages || Object.values(childrenStages).some((v) => !v)) {
      setStageError(t("forms.validation.required"));
      isValid = false;
    } else {
      setStageError("");
    }

    // Validate grades
    if (values.children.some((child) => !child.grade)) {
      setGradeError(t("forms.validation.required"));
      isValid = false;
    } else {
      setGradeError("");
    }

    // Validate nationality
    if (!nationality) {
      setNationalityError(t("forms.validation.required"));
      isValid = false;
    } else {
      setNationalityError("");
    }

    if (!nationalIdImage) {
      setNationalIdImageError("National ID image is required.");
      isValid = false;
    } else {
      setNationalIdImageError("");
    }

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
    formData.append("name", values.parentName);
    formData.append("quantity", values.childrenNumber);
    formData.append("relationship", values.relationship);
    formData.append("phone", values.mobile);
    formData.append("backupPhone", values.backupMobile);
    formData.append("email", values.email);
    formData.append("nationality", nationality);
    formData.append("nationalId", values.nationalId);
    if (nationalIdImage) {
      formData.append("nationalIdImage", nationalIdImage);
    }
    formData.append("trip", tripId);
    formData.append("formsType", formsType);
    if (values.promoCode) formData.append("promoCode", values.promoCode);

    // Append each child as a nested object (adjust keys as your backend expects)
    values.children.forEach((child, idx) => {
      formData.append(`childs[${idx}][name]`, child.studentName);
      formData.append(`childs[${idx}][nationalId]`, `${child.nationalId}`);
      formData.append(`childs[${idx}][academicStage]`, child.academicStage);
      formData.append(`childs[${idx}][grade]`, child.grade);
      formData.append(`childs[${idx}][formsType]`, formsType);

      if (child.studentMobile)
        formData.append(`childs[${idx}][phone]`, child.studentMobile);
      if (child.studentEmail)
        formData.append(`childs[${idx}][email]`, child.studentEmail);
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.STUDENT_REGISTER}`,
      headers,
      data: formData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        // resetForm();

        // Change acc to response
        const { _id } = response.data;
        if (_id) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });

          dispatch(setFinalTripDetailsData(response.data));

          router.push(`/${locale}/checkout`);
        }
      })

      .catch((error) => {
        setSubmitting(false);

        console.log("Error details:", error + formErrors);

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
        initialValues={{
          parentName: "",
          childrenNumber: childrenNumber,
          relationship: "",
          mobile: parentPhone || "",
          backupMobile: "",
          email: parentEmail || "",
          nationality: "",
          nationalId: "",
          promoCode: "",
          children: generateInitialChildren(childrenNumber),
        }}
        validationSchema={registerChildSchema}
        onSubmit={handleSubmit}
        // enableReinitialize={false}
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
        }) => {
          // Define handlers inside the Formik render function
          const handleChangeChildrenNumber = (event) => {
            const newCount = parseInt(event.target.value);
            setChildrenNumber(newCount);

            // Preserve existing children data
            let updatedChildren = [...values.children];

            if (updatedChildren.length < newCount) {
              // Add empty children if increasing
              for (let i = updatedChildren.length; i < newCount; i++) {
                updatedChildren.push({
                  studentName: "",
                  academicStage: "",
                  grade: "",
                  nationalId: "",
                  studentMobile: "",
                  studentEmail: "",
                });
              }
            } else if (updatedChildren.length > newCount) {
              // Remove extra children if decreasing
              updatedChildren = updatedChildren.slice(0, newCount);
            }

            setFieldValue("children", updatedChildren);
            setFieldValue("childrenNumber", newCount);

            // Reset stages for new children count
            const newStages = {};
            for (let i = 0; i < newCount; i++) {
              newStages[i] = childrenStages[i] || "";
            }
            setChildrenStages(newStages);
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
            try {
              const response = await axios.get(
                `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.STUDENTS_GRADES}/${newStage}/${educationSystem}`
              );
              setGradesList((prev) => ({
                ...prev,
                [childIndex]: response.data, // adjust according to your API response
              }));
            } catch (error) {
              setGradesList((prev) => ({
                ...prev,
                [childIndex]: [],
              }));
            }
          };

          const handleChangeChildGrade = (childIndex, event) => {
            const newGrade = event.target.value;
            setFieldValue(`children[${childIndex}].grade`, newGrade);
          };

          return (
            <form onSubmit={handleSubmit}>
              <ParentFormFields
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                childrenNumber={childrenNumber}
                handleChangeChildrenNumber={(event) =>
                  handleChangeChildrenNumber(event, setFieldValue)
                }
                handleChangeNationality={(event) =>
                  handleChangeNationality(event, setFieldValue)
                }
                setNationalIdImage={setNationalIdImage}
                nationalIdImageError={nationalIdImageError}
                setNationalIdImageError={setNationalIdImageError}
                childrenNumberList={childrenNumberList}
                nationalities={nationalities}
                t={t}
                cn={cn}
              />

              {/* Dynamic Children Fields */}
              <FieldArray
                name="children"
                className="transition-all duration-200 ease-in-out"
              >
                {/* eslint-disable-next-line no-unused-vars */}
                {({ push, remove }) => (
                  <div>
                    {values.children.map((child, index) => (
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
                        gradesList={gradesList[index] || []} // Pass grades for this child
                        handleChangeChildGrade={handleChangeChildGrade}
                        t={t}
                        cn={cn}
                      />
                    ))}
                  </div>
                )}
              </FieldArray>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`mx-auto px-20 lg:px-40 w-fit centered gap-2 mt-4 lg:mt-8 py-3 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                  isValid && "hover:bg-linksHover hover:border-linksHover"
                }`}
              >
                {isSubmitting ? (
                  <>
                    {t("forms.validation.sending")}
                    <CircularProgress size={24} sx={{ color: "#ED8A22" }} />
                  </>
                ) : (
                  t("links.continuePayment")
                )}
              </button>
            </form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default RegisterStudentForm;
