"use client";

import { useTranslations } from "next-intl";
import formatDate from "@utils/formatters/FormateDate";
import formatCurrency from "@utils/formatters/FormatCurrency";

const SummaryRow = ({ label, value, valueTeal = false, isLast = false }) => (
  <div
    className={`flex justify-between items-center gap-3 py-[9px] ${
      !isLast ? "border-b border-[#f3f4f6]" : ""
    }`}
  >
    {/* Label — FIRST → RIGHT in RTL */}
    <span className="text-[14px] leading-5 text-[rgba(0,60,78,0.6)] font-somar shrink-0 text-right">
      {label}
    </span>
    {/* Value — LAST → LEFT in RTL */}
    <span
      className={`text-[14px] font-bold leading-5 font-somar text-left ${
        valueTeal ? "text-[#017b7b]" : "text-[#003c4e]"
      }`}
    >
      {value ?? "—"}
    </span>
  </div>
);

const RequestSummaryCard = ({ data, locale }) => {
  const t = useTranslations("recommendations");

  const budget = data.priceRange?.min
    ? formatCurrency(data.priceRange.min)
    : data.basePrice
    ? formatCurrency(data.basePrice)
    : "—";

  const stages = data.academicStages?.map((s) => s.name).join("، ") || "—";

  const dateFormatted = formatDate(data.day, locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <div className="bg-white border-2 border-[rgba(1,123,123,0.2)] rounded-[16px] shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)] px-4 py-6 w-full">
      <div className="flex gap-2 items-center justify-start mb-4">
        {/* Dot FIRST → rightmost in RTL */}
        <span className="w-2 h-2 rounded-full bg-[#017b7b] shrink-0" />
        {/* Title SECOND → left of dot */}
        <span className="text-[18px] font-bold leading-[27px] text-[#003c4e] font-somar">
          {t("summary.title")}
        </span>
      </div>

      <div className="flex flex-col">
        <SummaryRow
          label={t("summary.school")}
          value={data.organization?.name}
        />
        <SummaryRow label={t("summary.grade")} value={stages} />
        <SummaryRow label={t("summary.city")} value={data.city?.name} />
        <SummaryRow label={t("summary.budget")} value={budget} valueTeal />
        <SummaryRow label={t("summary.seats")} value={data.availableSeats} />
        <SummaryRow label={t("summary.date")} value={dateFormatted} />
        <SummaryRow
          label={t("summary.tripType")}
          value={t(`tripTypes.${data.tripType}`, {
            defaultValue: data.tripType || "—",
          })}
          isLast
        />
      </div>
    </div>
  );
};

export default RequestSummaryCard;
