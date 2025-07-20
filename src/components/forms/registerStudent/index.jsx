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

  const [childrenNumber, setChildrenNumber] = useState(1);
  const [nationality, setNationality] = useState("");
  const [childrenStages, setChildrenStages] = useState({});

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

  const headers = getHeaders(locale);

  const registerChildSchema = useMemo(() => {
    return createRegisterChildSchema(t, childrenNumber);
  }, [childrenNumber, t]);

  const { academicStages, nationalities } = useSelector(
    (state) => state.tripDetailsData.data
  );

  const tripId = useSelector((state) => state.tripDetailsData.data?.trip?._id);

  const { enqueueSnackbar } = useSnackbar();

  // Helper function to generate initial children array
  const generateInitialChildren = (count) => {
    return Array.from({ length: count }, () => ({
      studentName: "",
      academicStage: "",
      nationalId: "",
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
  const validateCustomFields = () => {
    let isValid = true;

    if (!childrenStages) {
      setStageError(t("forms.validation.required"));
      isValid = false;
    } else {
      setStageError("");
    }

    if (!nationality) {
      setNationalityError(t("forms.validation.required"));
      isValid = false;
    } else {
      setNationalityError("");
    }

    return isValid;
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Validate custom fields before submission
    if (!validateCustomFields()) {
      setSubmitting(false);
      return;
    }

    let data = {
      name: values.parentName,
      childs: values.children.map((child) => ({
        name: child.studentName,
        nationalId: `${child.nationalId}`,
        academicStage: child.academicStage,
      })),
      quantity: values.childrenNumber,
      email: values.email,
      phone: values.mobile,
      nationality: nationality,
      promoCode: values.promoCode,
      trip: tripId,
    };

    let registerFormData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.STUDENT_REGISTER}`,
      headers,
      data: registerFormData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

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
          email: parentEmail || "",
          mobile: parentPhone || "",
          promoCode: "",
          nationality: "",
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

            // Update the children array in Formik
            const newChildren = generateInitialChildren(newCount);
            setFieldValue("children", newChildren);
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

          const handleChangeChildStage = (childIndex, event) => {
            const newStage = event.target.value;
            setChildrenStages((prev) => ({
              ...prev,
              [childIndex]: newStage,
            }));
            setFieldValue(`children[${childIndex}].academicStage`, newStage);
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
                        childrenStages={childrenStages}
                        handleChangeChildStage={handleChangeChildStage}
                        academicStages={academicStages}
                        t={t}
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
