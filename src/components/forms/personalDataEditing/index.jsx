"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { updateProfileData } from "@store/profile/profileInfoSlice";
import actGetCities from "@store/address/act/actGetCities";

import { memo, useState } from "react";

import { END_POINTS } from "@constants/APIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import { cn } from "@utils/helpers/cn";
import { createPersonalInfoEditingSchema } from "@utils/validators/validationSchemas";
import TextInputGroup from "../TextInputGroup";
import DropdownGroup from "../DropdownGroup";
import RadioButtonsGroup from "../RadioButtonsGroup";

import { Field, Formik } from "formik";

import FormSubmitButton from "@components/shared/FormSubmitButton";

import { useSnackbar } from "notistack";

import axios from "axios";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const PersonalDataEditing = ({ handleClose }) => {
  const [_, setFormErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const headers = getHeaders(locale);

  const profileData = useSelector((state) => state.profileData.data);
  const userInfo = profileData?.userInfo || {};

  const oldPhone = profileData.phone;
  const oldName = profileData.name;

  const oldGender = userInfo.gender;

  const oldBirthDay = userInfo.birthDay || null;

  const oldNationality = userInfo.nationality || "";
  const oldCountryOfResidence = userInfo.countryOfResidence || "";
  const oldCity = userInfo.city || "";

  // Gender
  const [gender, setGender] = useState(oldGender);
  const handleChangeNGender = (event) => {
    setGender(event.target.value);
  };

  const genderTypes = [
    { name: t("common.MALE"), value: "MALE" },
    { name: t("common.FEMALE"), value: "FEMALE" },
  ];

  // Birth day
  const [selectedDate, setSelectedDate] = useState(
    dayjs(oldBirthDay, "DD-MM-YYYY")
  );
  const formattedDate = dayjs(selectedDate).format("DD-MM-YYYY");

  // Nationality
  const nationalities = useSelector(
    (state) => state.address?.list?.nationalities
  );
  const [nationality, setNationality] = useState(oldNationality._id);
  const handleChangeNationality = (event) => {
    setNationality(event.target.value);
  };

  // Country of residence
  const countries = useSelector((state) => state.address?.list?.countries);
  const [countryOfResidence, setCountryOfResidence] = useState(
    oldCountryOfResidence._id
  );
  const handleChangeCountryOfResidence = (event) => {
    const selectedCountryId = event.target.value;
    setCountryOfResidence(selectedCountryId);

    // Only dispatch if countryId is valid
    if (selectedCountryId) {
      dispatch(
        actGetCities({
          countryId: selectedCountryId,
          headers: headers,
        })
      );
    }
  };

  // City
  const cities = useSelector((state) => state.address?.cities);
  const [city, setCity] = useState(oldCity._id);
  const handleChangeCity = (event) => {
    setCity(event.target.value);
  };

  const dispatch = useDispatch();

  const infoEditing = createPersonalInfoEditingSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const initialValues = {
    mobile: oldPhone || "",
    name: oldName || "",
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = {
      phone: values.mobile,
      name: values.name,
      userInfo: {
        gender,
        birthDay: formattedDate,
        nationality,
        countryOfResidence,
        city,
      },
    };

    let newPersonalInformation = JSON.stringify(data);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${END_POINTS.MAIN}${END_POINTS.PROFILE.EDIT_PERSONAL_INFO}`,

      headers,
      data: newPersonalInformation,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        if (response.data) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });

          dispatch(updateProfileData(data));
          handleClose();
        }
      })

      .catch((error) => {
        setDisabledButton(false);
        setSubmitting(false);

        const errorMessage = getErrorMessage(error, t);

        enqueueSnackbar(errorMessage, {
          variant: "error",
        });

        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  const isRTL = locale === "ar";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={infoEditing}
      onSubmit={handleSubmit}
      enableReinitialize
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
      }) => (
        <form onSubmit={handleSubmit} className="px-2 lg:px-6 lg:w-[530px]">
          <h2 className="mb-2 text-xl font-semibold text-black">
            {t("profile.editingDataForms.personalInformationEditing")}
          </h2>

          <div className="flex flex-col w-full gap-5 py-5 lg:pt-10">
            <div className="relative flex flex-col gap-2">
              <label className="font-medium capitalize font-ibm">
                {t("forms.phone.name")}
              </label>

              <Field name="mobile">
                {({ field }) => (
                  <PhoneInputWithCountrySelect
                    {...field}
                    international
                    defaultCountry="SA"
                    value={values.mobile}
                    onChange={(value) => {
                      setFieldValue("mobile", value);
                    }}
                    errors={errors.mobile}
                    touched={touched.mobile}
                    onBlur={handleBlur}
                    id="mobile"
                    addInternationalOption={false}
                    style={{ direction: "ltr" }}
                    flagComponent={({ country }) => (
                      <span style={{ fontSize: "1.2em", marginRight: "0.5em" }}>
                        {getUnicodeFlagIcon(country)}
                      </span>
                    )}
                    className={cn(
                      "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50  transition-all duration-200 ease-in-out",
                      errors.mobile && touched.mobile
                        ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                        : "border-border PhoneInputInput-focus:border-textDark hover:border-textDark"
                    )}
                  />
                )}
              </Field>
              {errors.mobile && touched.mobile && (
                <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                  {errors.mobile}
                </div>
              )}
            </div>

            <TextInputGroup
              label={t("forms.name.name")}
              type="name"
              name="name"
              value={values.name}
              errors={errors.name}
              touched={touched.name}
              onChange={(e) => {
                handleChange(e);
              }}
              onBlur={handleBlur}
              placeholder={oldName}
            />

            {/* gender */}
            <RadioButtonsGroup
              list={genderTypes}
              onChange={handleChangeNGender}
              genderState={gender}
            />

            {/* birthDay */}
            <div className="flex flex-col gap-2">
              <label className="font-medium capitalize font-ibm">
                {t("profile.information.personalInformation.birthDay")}
              </label>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={locale}
              >
                <div dir={isRTL ? "rtl" : "ltr"}>
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{
                      padding: 0,
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                  >
                    <DatePicker
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      format="DD/MM/YYYY"
                      sx={{
                        width: "100%",
                        padding: 0,
                        "& .MuiPickersInputBase-root": {
                          border: "2px solid #eaeaea",
                          borderRadius: "8px",
                          // direction: isRTL ? "rtl !important" : "ltr",
                        },
                        "& .MuiPickersSectionList-root": {
                          direction: isRTL ? "rtl !important" : "ltr",
                        },
                      }}
                    />
                  </DemoContainer>
                </div>
              </LocalizationProvider>
            </div>

            {/* Nationality */}
            <DropdownGroup
              label={t("profile.information.personalInformation.nationality")}
              placeholder={oldNationality.name}
              value={nationality}
              onChange={handleChangeNationality}
              // value={values.nationality}
              // onChange={(e) => setFieldValue("nationality", e.target.value)}
              menuItemsList={nationalities}
            />

            <DropdownGroup
              label={t(
                "profile.information.personalInformation.countryOfResidence"
              )}
              placeholder={oldCountryOfResidence.name}
              value={countryOfResidence}
              onChange={handleChangeCountryOfResidence}
              menuItemsList={countries}
            />

            <DropdownGroup
              label={t("profile.information.personalInformation.city")}
              placeholder={oldCity.name}
              value={city}
              onChange={handleChangeCity}
              menuItemsList={cities}
            />

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={handleClose}
                type="button"
                className="px-8 py-3 text-black transition-all duration-200 ease-in-out hover:text-mainColor"
              >
                {t("links.cancel")}
              </button>

              <FormSubmitButton
                loading={isSubmitting}
                disabled={!isValid || disabledButton}
                label={t("links.saveChange")}
                isValid={isValid}
                className="py-3 px-8 text-base"
              />
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default memo(PersonalDataEditing);
