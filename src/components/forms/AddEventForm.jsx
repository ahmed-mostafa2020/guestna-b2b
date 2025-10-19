"use client";

import { useTranslations, useLocale } from "next-intl";
import { Formik, Form } from "formik";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { createAddEventSchema } from "@utils/validationSchemas";
import axios from "axios";
import { useSnackbar } from "notistack";

import TextInputGroup from "./TextInputGroup";
import SelectionGroup from "./SelectionGroup";
import CustomizedModal from "@components/common/customizedModal";
import ModalHeader from "@components/sections/pages/calendar/ModalHeader";
import ModalFooter from "@components/sections/pages/calendar/ModalFooter";
import formatDate from "@utils/FormateDate";
import { getEventTypes, mapLabelToValue } from "@utils/eventTypeUtils";

const AddEventForm = ({
  selectedDate,
  onClose,
  onSuccess,
  eventToEdit = null,
}) => {
  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  // Helper function to format date for API (avoids timezone issues)
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initial form values
  const getInitialValues = () => ({
    name: eventToEdit?.name || "",
    about: eventToEdit?.about || "",
    happeningType: eventToEdit?.happeningType || "",
    place: eventToEdit?.place || "",
    day: eventToEdit?.day
      ? formatDateForAPI(new Date(eventToEdit.day))
      : selectedDate
      ? formatDateForAPI(selectedDate)
      : "",
    time: eventToEdit?.time || "",
    participantsCount: eventToEdit?.participantsCount || 1,
  });

  // Get event types from centralized utility
  const eventTypes = getEventTypes(t);

  // Submit handler
  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus(null);

    try {
      const headers = getHeaders();
      const url = eventToEdit
        ? getProxyUrl(
            `${B2B_END_POINTS.PROFILE.HAPPENINGS.UPDATE}/${eventToEdit._id}`
          )
        : getProxyUrl(B2B_END_POINTS.PROFILE.HAPPENINGS.CREATE);

      const method = eventToEdit ? "PATCH" : "POST";

      // Prepare form data with mapped happening type
      const submissionData = {
        ...values,
        happeningType: mapLabelToValue(values.happeningType, t),
        participantsCount: parseInt(values.participantsCount),
      };

      const response = await axios({
        method,
        url,
        headers,
        data: submissionData,
      });

      if (response.status === 200 || response.status === 201) {
        // Show success message
        enqueueSnackbar(
          eventToEdit
            ? t("profile.calendar.modal.addEvent.success.editSuccess")
            : t("profile.calendar.modal.addEvent.success.createSuccess"),
          { variant: "success" }
        );
        onSuccess();
        onClose();
      } else {
        setStatus(
          eventToEdit
            ? t("profile.calendar.modal.addEvent.errors.editError")
            : t("profile.calendar.modal.addEvent.errors.generalError")
        );
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      if (error.response?.data?.message) {
        setStatus(error.response.data.message);
      } else {
        setStatus(
          eventToEdit
            ? t("profile.calendar.modal.addEvent.errors.editError")
            : t("profile.calendar.modal.addEvent.errors.generalError")
        );
      }
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
      closeButton={false}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <Formik
            initialValues={getInitialValues()}
            validationSchema={createAddEventSchema(t)}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              isSubmitting,
              status,
              isValid,
              dirty,
            }) => (
              <Form>
                <ModalHeader
                  title={
                    eventToEdit
                      ? t("profile.calendar.modal.addEvent.editEvent")
                      : t("profile.calendar.modal.addEvent.title")
                  }
                  onClose={onClose}
                  subtitle={
                    selectedDate
                      ? `${t(
                          "profile.calendar.modal.addEvent.fields.date"
                        )}: ${formatDate(selectedDate, locale, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}`
                      : null
                  }
                />

                <div className="p-6 space-y-6">
                  {/* General Error */}
                  {status && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {status}
                    </div>
                  )}

                  {/* Event Name */}
                  <TextInputGroup
                    label={t(
                      "profile.calendar.modal.addEvent.fields.eventName"
                    )}
                    type="text"
                    name="name"
                    id="event-name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t(
                      "profile.calendar.modal.addEvent.fields.eventNamePlaceholder"
                    )}
                    errors={errors.name}
                    touched={touched.name}
                    maxLength={100}
                  />

                  {/* Event Description */}
                  <TextInputGroup
                    label={t(
                      "profile.calendar.modal.addEvent.fields.description"
                    )}
                    type="text"
                    name="about"
                    id="event-description"
                    value={values.about}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t(
                      "profile.calendar.modal.addEvent.fields.descriptionPlaceholder"
                    )}
                    errors={errors.about}
                    touched={touched.about}
                    textarea={true}
                    rows={4}
                    maxLength={500}
                  />

                  {/* Event Type */}
                  <div className="space-y-2">
                    <label
                      htmlFor="event-type"
                      className="pb-2 font-medium capitalize font-ibm"
                    >
                      {t("profile.calendar.modal.addEvent.fields.eventType")}
                    </label>
                    <SelectionGroup
                      name="happeningType"
                      id="event-type"
                      value={
                        eventTypes.find(
                          (type) => type.value === values.happeningType
                        )?.label ||
                        values.happeningType ||
                        ""
                      }
                      onChange={(e) => {
                        const selectedLabel = e.target.value;
                        setFieldValue("happeningType", selectedLabel);
                      }}
                      placeholder={t(
                        "profile.calendar.modal.addEvent.fields.selectEventType"
                      )}
                      list={eventTypes.map((type) => type.label)}
                      errors={errors.happeningType}
                      touched={touched.happeningType}
                    />
                  </div>

                  {/* Location */}
                  <TextInputGroup
                    label={t("profile.calendar.modal.addEvent.fields.location")}
                    type="text"
                    name="place"
                    id="event-location"
                    value={values.place}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t(
                      "profile.calendar.modal.addEvent.fields.locationPlaceholder"
                    )}
                    errors={errors.place}
                    touched={touched.place}
                    maxLength={200}
                  />

                  {/* Participants Count */}
                  <TextInputGroup
                    label={t(
                      "profile.calendar.modal.addEvent.fields.participants"
                    )}
                    type="number"
                    name="participantsCount"
                    id="event-participants"
                    value={values.participantsCount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t(
                      "profile.calendar.modal.addEvent.fields.participantsPlaceholder"
                    )}
                    errors={errors.participantsCount}
                    touched={touched.participantsCount}
                    min={1}
                    max={1000}
                  />

                  {/* Date and Time Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <TextInputGroup
                      label={t("profile.calendar.modal.addEvent.fields.date")}
                      type="date"
                      name="day"
                      id="event-date"
                      value={values.day}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors.day}
                      touched={touched.day}
                      min={formatDateForAPI(new Date())}
                    />

                    {/* Time */}
                    <TextInputGroup
                      label={t("profile.calendar.modal.addEvent.fields.time")}
                      type="time"
                      name="time"
                      id="event-time"
                      value={values.time}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      errors={errors.time}
                      touched={touched.time}
                    />
                  </div>

                  {/* Edit mode helper text */}
                  {eventToEdit && !dirty && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                      {t("profile.calendar.modal.addEvent.errors.noChangesMessage")}
                    </div>
                  )}
                </div>

                <ModalFooter
                  onCancel={onClose}
                  onConfirm={() => {}} // Formik handles submit
                  cancelText={t(
                    "profile.calendar.modal.addEvent.actions.cancel"
                  )}
                  confirmText={
                    eventToEdit
                      ? t("profile.calendar.modal.addEvent.actions.edit")
                      : t("profile.calendar.modal.addEvent.actions.save")
                  }
                  isLoading={isSubmitting}
                  confirmDisabled={!isValid || isSubmitting}
                  isForm={true}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </CustomizedModal>
  );
};
export default AddEventForm;
