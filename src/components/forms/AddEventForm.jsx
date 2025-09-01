"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import axios from "axios";

import TextInputGroup from "./TextInputGroup";
import SelectionGroup from "./SelectionGroup";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {eventToEdit ? "تعديل الحدث" : "إضافة حدث جديد"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {selectedDate && (
            <p className="text-gray-600 mt-2">
              التاريخ المحدد:{" "}
              {selectedDate.toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>

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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {eventToEdit ? "جاري التعديل..." : "جاري الإضافة..."}
                </div>
              ) : eventToEdit ? (
                "تعديل الحدث"
              ) : (
                "إضافة الحدث"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
