"use client";

import { useFormikContext } from "formik";
import { useLocale, useTranslations } from "next-intl";

import FormSectionCard from "../FormSectionCard";
import { findNameById } from "@utils/helpers/selectionHelpers";

const ReviewRow = ({ label, value }) => (
  <div className="flex flex-col gap-1 py-2 border-b border-border last:border-b-0">
    <span className="font-medium capitalize font-somar text-textLight">
      {label}
    </span>
    <span className="font-medium font-somar text-textDark break-words">
      {value || "—"}
    </span>
  </div>
);

const StepReview = ({ cityOptions = [], serviceOptions = [], onEditStep }) => {
  const t = useTranslations("providerRegister");
  const locale = useLocale();
  const { values } = useFormikContext();

  const cityName = findNameById(cityOptions, values.city);

  const businessTypeLabel = values.businessType
    ? t(`businessTypes.${values.businessType}`)
    : "";

  const servicesLabel = (values.services || [])
    .map((serviceId) => findNameById(serviceOptions, serviceId))
    .filter(Boolean)
    .join(locale === "ar" ? "، " : ", ");

  const hoursLabel =
    values.businessHoursFrom && values.businessHoursTo
      ? `${values.businessHoursFrom} – ${values.businessHoursTo}`
      : "";

  return (
    <div className="flex flex-col gap-5">
      <FormSectionCard
        title={t("review.title")}
        subtitle={t("review.subtitle")}
        action={
          onEditStep ? (
            <button
              type="button"
              onClick={() => onEditStep(0)}
              className="text-sm font-semibold text-mainColor font-somar hover:text-linksHover transition-colors"
            >
              {t("review.edit")}
            </button>
          ) : null
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <ReviewRow label={t("fields.nameAr.label")} value={values.name?.ar} />
          <ReviewRow label={t("fields.nameEn.label")} value={values.name?.en} />
          <ReviewRow
            label={t("fields.legalNameAr.label")}
            value={values.legalName?.ar}
          />
          <ReviewRow
            label={t("fields.legalNameEn.label")}
            value={values.legalName?.en}
          />
          <ReviewRow
            label={t("fields.crNumber.label")}
            value={values.crNumber}
          />
          <ReviewRow
            label={t("fields.taxNumber.label")}
            value={values.taxNumber}
          />
          <ReviewRow
            label={t("fields.businessType.label")}
            value={businessTypeLabel}
          />
          <ReviewRow label={t("fields.services.label")} value={servicesLabel} />
          <ReviewRow label={t("fields.email.label")} value={values.email} />
          <ReviewRow label={t("fields.phone.label")} value={values.phone} />
        </div>
        <ReviewRow label={t("fields.aboutAr.label")} value={values.about?.ar} />
        <ReviewRow label={t("fields.aboutEn.label")} value={values.about?.en} />
      </FormSectionCard>

      <FormSectionCard
        title={t("location.title")}
        subtitle={t("review.locationSubtitle")}
        action={
          onEditStep ? (
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-sm font-semibold text-mainColor font-somar hover:text-linksHover transition-colors"
            >
              {t("review.edit")}
            </button>
          ) : null
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <ReviewRow label={t("fields.city.label")} value={cityName} />
          <ReviewRow
            label={t("fields.district.label")}
            value={values.district}
          />
          <ReviewRow
            label={t("fields.businessHours.label")}
            value={hoursLabel}
          />
        </div>
        <ReviewRow label={t("fields.address.label")} value={values.address} />
      </FormSectionCard>
    </div>
  );
};

export default StepReview;
