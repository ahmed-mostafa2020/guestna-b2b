"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import axios from "axios";

import TextInputGroup from "./TextInputGroup";
import SelectionGroup from "./SelectionGroup";
import Modal from "@components/sections/pages/calendar/Modal";
import ModalHeader from "@components/sections/pages/calendar/ModalHeader";
import ModalFooter from "@components/sections/pages/calendar/ModalFooter";

const AddEventForm = ({
  selectedDate,
  onClose,
  onSuccess,
  eventToEdit = null,
}) => {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    about: "",
    happeningType: "",
    place: "",
    day: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
    time: "",
    participantsCount: 1,
  });

  // Initialize form data when editing
  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name || "",
        about: eventToEdit.about || "",
        happeningType: eventToEdit.happeningType || "",
        place: eventToEdit.place || "",
        day: eventToEdit.day
          ? new Date(eventToEdit.day).toISOString().split("T")[0]
          : "",
        time: eventToEdit.time || "",
        participantsCount: eventToEdit.participantsCount || 1,
      });
    }
  }, [eventToEdit]);

  // Event types based on the calendar page
  const eventTypes = [
    { value: "TRIP", label: "رحلة" },
    { value: "ACADEMIC", label: "أكاديمي" },
    { value: "ADMINISTRATIVE", label: "إداري" },
    { value: "ENTERTAINMENT", label: "ترفيهي" },
    { value: "METING", label: "اجتماع" },
    { value: "EXAM", label: "امتحان" },
  ];

  // Map Arabic labels to English values
  const getEventTypeValue = (arabicLabel) => {
    const eventType = eventTypes.find((type) => type.label === arabicLabel);
    return eventType ? eventType.value : "";
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Special handling for happeningType to convert Arabic label to English value
    let finalValue =
      name === "happeningType" ? getEventTypeValue(value) : value;

    // Convert number inputs to actual numbers
    if (type === "number") {
      finalValue = value === "" ? "" : parseInt(value, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم الحدث مطلوب";
    }

    if (!formData.about.trim()) {
      newErrors.about = "وصف الحدث مطلوب";
    }

    if (!formData.happeningType) {
      newErrors.happeningType = "نوع الحدث مطلوب";
    }

    if (!formData.place.trim()) {
      newErrors.place = "موقع الحدث مطلوب";
    }

    if (!formData.participantsCount || formData.participantsCount < 1) {
      newErrors.participantsCount = "عدد المشاركين يجب أن يكون رقم موجب";
    }

    if (!formData.day) {
      newErrors.day = "تاريخ الحدث مطلوب";
    }

    if (!formData.time) {
      newErrors.time = "وقت الحدث مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const config = {
        method: eventToEdit ? "put" : "post",
        url: getProxyUrl(
          eventToEdit
            ? `${B2B_END_POINTS.PROFILE.HAPPENINGS.ALL}/${eventToEdit._id}`
            : B2B_END_POINTS.PROFILE.HAPPENINGS.NEW
        ),
        headers: getHeaders(),
        data: formData,
      };

      const response = await axios.request(config);

      if (response.status === 200 || response.status === 201) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Error saving event:", error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({
          general: eventToEdit
            ? "حدث خطأ أثناء تعديل الحدث"
            : "حدث خطأ أثناء إضافة الحدث",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalHeader
        title={eventToEdit ? "تعديل الحدث" : "إضافة حدث جديد"}
        onClose={onClose}
        subtitle={
          selectedDate
            ? `التاريخ المحدد: ${selectedDate.toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}`
            : null
        }
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Event Name */}
        <TextInputGroup
          label="اسم الحدث"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="أدخل اسم الحدث"
          errors={errors.name}
          touched={!!errors.name}
          maxLength={100}
        />

        {/* Event Description */}
        <TextInputGroup
          label="وصف الحدث"
          type="text"
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          placeholder="أدخل وصف الحدث"
          errors={errors.about}
          touched={!!errors.about}
          textarea={true}
          rows={4}
          maxLength={500}
        />

        {/* Event Type */}
        <div className="space-y-2">
          <label className="font-medium capitalize font-ibm">نوع الحدث</label>
          <SelectionGroup
            name="happeningType"
            value={
              eventTypes.find((type) => type.value === formData.happeningType)
                ?.label || ""
            }
            onChange={handleInputChange}
            placeholder="اختر نوع الحدث"
            list={eventTypes.map((type) => type.label)}
            errors={errors.happeningType}
            touched={!!errors.happeningType}
          />
        </div>

        {/* Location */}
        <TextInputGroup
          label="موقع الحدث"
          type="text"
          name="place"
          value={formData.place}
          onChange={handleInputChange}
          placeholder="أدخل موقع الحدث"
          errors={errors.place}
          touched={!!errors.place}
          maxLength={200}
        />

        {/* Participants Count */}
        <TextInputGroup
          label="عدد المشاركين"
          type="number"
          name="participantsCount"
          value={formData.participantsCount}
          onChange={handleInputChange}
          placeholder="أدخل عدد المشاركين"
          errors={errors.participantsCount}
          touched={!!errors.participantsCount}
          min={1}
          max={1000}
        />

        {/* Date and Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <TextInputGroup
            label="تاريخ الحدث"
            type="date"
            name="day"
            value={formData.day}
            onChange={handleInputChange}
            errors={errors.day}
            touched={!!errors.day}
            min={new Date().toISOString().split("T")[0]}
          />

          {/* Time */}
          <TextInputGroup
            label="وقت الحدث"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            errors={errors.time}
            touched={!!errors.time}
          />
        </div>
      </form>

      <ModalFooter
        onCancel={onClose}
        onConfirm={() => {}}
        cancelText="إلغاء"
        confirmText={eventToEdit ? "تعديل الحدث" : "إضافة الحدث"}
        isLoading={isSubmitting}
        isForm={true}
      />
    </Modal>
  );
};

export default AddEventForm;
