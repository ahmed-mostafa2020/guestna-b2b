"use client";

import { useTranslations, useLocale } from "next-intl";
import { Formik, Form } from "formik";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { createEditTripSettingsSchema } from "@utils/validationSchemas";
import axios from "axios";
import { useSnackbar } from "notistack";

import { CONSTANT_VALUES } from "@constants/constantValues";
import TextInputGroup from "./TextInputGroup";
import CustomizedModal from "@components/common/customizedModal";
import { CircularProgress } from "@mui/material";
import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

const EditTripSettingsForm = ({ item, onClose, onSuccess }) => {
  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  // Helper function to translate gender
  const translateGender = (gender) => {
    switch (gender) {
      case CONSTANT_VALUES.GENDERS.MALE:
        return t("common.MALE");
      case CONSTANT_VALUES.GENDERS.FEMALE:
        return t("common.FEMALE");
      case CONSTANT_VALUES.GENDERS.BOTH:
        return t("common.BOTH");
      default:
        return gender || "";
    }
  };

  // Build track info display string
  const buildTrackInfoDisplay = () => {
    if (!item?.track) return "-";

    const track = item.track;
    const parts = [];

    // Education system name
    if (track.educationSystem?.name) {
      parts.push(track.educationSystem.name);
    }

    // Gender (translated)
    if (track.gender) {
      parts.push(translateGender(track.gender));
    }

    // Academic stages names
    if (track.academicStages?.length > 0) {
      const stageNames = track.academicStages
        .map((stage) => stage.name)
        .join(" - ");
      parts.push(stageNames);
    }

    return parts.join(" - ") || "-";
  };

  // Initial form values
  const getInitialValues = () => ({
    trackInfo: buildTrackInfoDisplay(),
    currentTrips: item?.tripsCount || 0,
    maximumNumberTrips: item?.maximumNumberTrips || 0,
  });

  // Submit handler
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null);

    try {
      const headers = getHeaders();
      const url = getProxyUrl(
        `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.SETTINGS.SUBMIT}/${item._id}`
      );

      const body = {
        organization: item.organization?._id,
        maximumNumberTrips: parseInt(values.maximumNumberTrips),
      };

      // Add track if exists (optional)
      if (item.track?._id) {
        body.track = item.track._id;
      }

      const response = await axios({
        method: "PATCH",
        url,
        headers,
        data: body,
      });

      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar(
          t("profile.tables.orders.settingsTable.editModal.success"),
          { variant: "success" }
        );
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Error updating trip settings:", error);
      enqueueSnackbar(
        error.response?.data?.message ||
          t("profile.tables.orders.settingsTable.editModal.error"),
        { variant: "error" }
      );
      setStatus({ error: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CustomizedModal
      open={true}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      customizedCloseButton={true}
      closeButton={true}
      padding={false}
    >
      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-6 border-b border-black">
            <h2 className="text-2xl font-bold text-center text-black">
              {t("profile.tables.orders.settingsTable.editModal.title")}
            </h2>
            <p className="text-black text-center mt-2">
              {t("profile.tables.orders.settingsTable.editModal.subtitle")}
            </p>
          </div>

          {/* Form */}
          <Formik
            initialValues={getInitialValues()}
            validationSchema={createEditTripSettingsSchema(
              t,
              item?.tripsCount || 0
            )}
            onSubmit={handleSubmit}
            validateOnMount={true}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              isValid,
              handleChange,
              handleBlur,
            }) => (
              <Form className="px-4 py-8 space-y-5">
                {/* Track Info - Readonly */}
                <TextInputGroup
                  label={t(
                    "profile.tables.orders.settingsTable.editModal.trackLabel"
                  )}
                  type="text"
                  name="trackInfo"
                  value={values.trackInfo}
                  readOnly={true}
                />

                {/* Current Trips - Readonly */}
                <TextInputGroup
                  label={t(
                    "profile.tables.orders.settingsTable.editModal.currentTripsLabel"
                  )}
                  type="number"
                  name="currentTrips"
                  value={values.currentTrips}
                  readOnly={true}
                />

                {/* New Maximum Trips - Editable */}
                <TextInputGroup
                  label={t(
                    "profile.tables.orders.settingsTable.editModal.newMaxTripsLabel"
                  )}
                  type="number"
                  name="maximumNumberTrips"
                  value={values.maximumNumberTrips}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={item?.tripsCount || 0}
                  max={10}
                  errors={errors.maximumNumberTrips}
                  touched={touched.maximumNumberTrips}
                  required={true}
                  autoFocus={true}
                />

                {/* Footer Buttons */}
                <div className="flex gap-4 pt-4 font-ibm">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 lg:px-8 px-4 py-3 font-medium transition-all duration-200 ease-in-out bg-white border-2 rounded-lg border-mainColor hover:text-white hover:bg-linksHover hover:border-linksHover"
                    {...getGtmTag(GTM_TAGS.FORMS.CANCEL, "forms")}
                  >
                    {t("links.cancel")}
                  </button>

                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="flex-1 px-6 py-3 bg-mainColor text-white font-medium rounded-lg hover:bg-linksHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    {...getGtmTag(GTM_TAGS.FORMS.SUBMIT, "forms")}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} sx={{ color: "white" }} />
                        {t("links.sendRequest")}
                      </>
                    ) : (
                      t("links.save")
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default EditTripSettingsForm;
