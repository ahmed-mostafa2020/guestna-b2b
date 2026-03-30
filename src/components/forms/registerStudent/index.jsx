"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { setFinalTripDetailsData } from "@store/checkout/finalTripDetailsSlice";

import { memo, useMemo, useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { createRegisterChildSchema } from "@utils/validators/validationSchemas";
import { getHeaders } from "@utils/helpers/getHeaders";
import { cn } from "@utils/helpers/cn";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import getProxyUrl from "@utils/api/getProxyUrl";

import { FieldArray, Formik } from "formik";

import axios from "axios";

import { useSnackbar } from "notistack";

import FormSubmitButton from "@components/ui/FormSubmitButton";
import {
  Container,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ParentFormFields from "./ParentFormFields";
import ChildForm from "./childForms/ChildForm";
import CustomizedRiyadhForm from "./childForms/CustomizedRiyadhForm";
import TermsConfirmationModal from "./TermsConfirmationModal";
import { infoIcon } from "@assets/svg";

const RegisterStudentForm = ({
  tripMainCategory,
  availableSeats,
  termsData,
}) => {
  const [_, setNationalityError] = useState("");
  const [__, setStageError] = useState("");
  const [___, setGradeError] = useState("");

  const [childrenNumber, setChildrenNumber] = useState(1);
  const [nationality, setNationality] = useState("68052bdd38ea31c8cf95dc04");
  const [nationalIdImage, setNationalIdImage] = useState(null);
  const [nationalIdImageError, setNationalIdImageError] = useState("");

  const [childrenStages, setChildrenStages] = useState({});
  const [gradesList, setGradesList] = useState({});
  const [gradesLoading, setGradesLoading] = useState({});
  const [childrenNationalIdImages, setChildrenNationalIdImages] = useState([]); // array of files
  const [childrenNationalIdImagesError, setChildrenNationalIdImagesError] =
    useState([]);

  // Terms confirmation state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

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

  const registerChildSchema = useMemo(() => {
    return createRegisterChildSchema(t, childrenNumber, tripMainCategory);
  }, [childrenNumber, t, tripMainCategory]);

  const { nationalities, trip } = useSelector(
    (state) => state.tripDetailsData.data
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

  const tripId = useSelector((state) => state.tripDetailsData.data?.trip?._id);
  const tripName = useSelector(
    (state) => state.tripDetailsData.data?.trip?.name
  );

  const { enqueueSnackbar } = useSnackbar();

  // Helper function to generate initial children array
  const generateInitialChildren = (count) => {
    return Array.from({ length: count }, () => {
      const child = {
        studentName: "",
        academicStage: "",
        grade: "",
        nationalId: "",
        studentMobile: "",
        studentEmail: "",
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
    formData.append("quantity", values.childrenNumber);
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
    formData.append("termsAccepted", termsAccepted ? "true" : "false");
    if (termsData?._id) {
      formData.append("termsAndCondition", termsData._id);
    }

    // Append each child as a nested object
    values.children.forEach((child, idx) => {
      formData.append(`childs[${idx}].name`, child.studentName);
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

      formData.append(`childs[${idx}].formsType`, formsType);

      if (child.studentMobile)
        formData.append(`childs[${idx}].phone`, child.studentMobile);
      if (child.studentEmail)
        formData.append(`childs[${idx}].email`, child.studentEmail);
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
          if (response.data.basePriceTotalWithVat === undefined) {
            console.error(
              "WARNING: Response missing basePriceTotalWithVat field",
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
        initialValues={{
          parentName: "",
          childrenNumber: childrenNumber,
          relationship: "",
          mobile: parentPhone || "",
          backupMobile: "",
          email: parentEmail || "",
          nationality: "68052bdd38ea31c8cf95dc04",
          nationalId: "",
          promoCode: "",
          children: generateInitialChildren(childrenNumber),
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
                const newChild = {
                  studentName: "",
                  academicStage: "",
                  grade: "",
                  nationalId: "",
                  studentMobile: "",
                  studentEmail: "",
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

            // Set loading state for this child's grade dropdown
            setGradesLoading((prev) => ({
              ...prev,
              [childIndex]: true,
            }));

            // Fetch grades for the selected stage
            try {
              const response = await axios.get(
                getProxyUrl(
                  `${B2B_END_POINTS.STUDENTS_GRADES}/${tripId}/${newStage}/${educationSystem}`
                ),
                { headers: headersGetMethod }
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
            } finally {
              // Clear loading state
              setGradesLoading((prev) => ({
                ...prev,
                [childIndex]: false,
              }));
            }
          };

          const handleChangeChildGrade = (childIndex, event) => {
            const newGrade = event.target.value;
            setFieldValue(`children[${childIndex}].grade`, newGrade);
          };

          return (
            <form onSubmit={handleSubmit} id="register-student-form">
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
              {/* tripMainCategory ===
              CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH */}

              <FieldArray
                name="children"
                className="transition-all duration-200 ease-in-out"
              >
                {/* eslint-disable-next-line no-unused-vars */}
                {({ push, remove }) => (
                  <div>
                    {values.children.map((child, index) => {
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
                          tripMainCategory={tripMainCategory}
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
                        />
                      );
                    })}
                  </div>
                )}
              </FieldArray>

              {/* Terms Confirmation Checkbox */}
              <div className="mt-6 p-4 bg-[#FFF1764D] rounded-xl">
                <FormControlLabel
                  sx={{
                    alignItems: "flex-start",
                    margin: 0,
                    width: "100%",
                    "& .MuiFormControlLabel-label": {
                      color: "#1F2626",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      fontFamily: "var(--font-somar-sans), sans-serif",
                    },
                  }}
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      sx={{
                        padding: "4px",
                        marginTop: "-4px",
                        color: "var(--color-text-dark)",
                        "& .MuiSvgIcon-root": { fontSize: 24 },
                        "&.Mui-checked": {
                          color: "var(--color-title)",
                        },
                      }}
                    />
                  }
                  label={
                    <span className="font-semibold">
                      {t("forms.termsConfirmation.checkboxLabel")}{" "}
                      <button
                        type="button"
                        onClick={() => setTermsModalOpen(true)}
                        className="text-mainColor underline hover:text-linksHover font-semibold transition-colors"
                      >
                        {t("forms.termsConfirmation.termsLinkText")}
                      </button>
                    </span>
                  }
                />

                <div className="flex items-center gap-2 mt-4">
                  {infoIcon}
                  <p className="text-sm text-textLight">
                    {t("forms.termsConfirmation.infoText")}
                  </p>
                </div>
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

              <FormSubmitButton
                loading={isSubmitting}
                disabled={
                  !isValid ||
                  !nationality ||
                  !termsAccepted ||
                  Object.values(childrenStages).some((v) => !v) ||
                  values.children.some((child) => !child.grade)
                }
                label={t("links.continuePayment")}
                isValid={
                  isValid &&
                  !!nationality &&
                  !!termsAccepted &&
                  !Object.values(childrenStages).some((v) => !v) &&
                  !values.children.some((child) => !child.grade)
                }
                className="mx-auto px-20 lg:px-40 w-fit mt-4 lg:mt-8 py-3 text-base"
              />
            </form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default memo(RegisterStudentForm);
