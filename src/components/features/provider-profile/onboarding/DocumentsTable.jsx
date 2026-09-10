"use client";

import { memo, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Add as AddIcon,
  VisibilityOutlined as ViewIcon,
  UploadOutlined as UploadIcon,
  ReplayOutlined as ReuploadIcon,
} from "@mui/icons-material";
import DataTable from "@components/ui/DataTable";
import { CONSTANT_VALUES } from "@constants/constantValues";

const REQUIRED_TYPES = new Set(["COMMERCIAL_REGISTRATION", "TAX_CERTIFICATE"]);

const STATUS_STYLES = {
  PENDING: {
    bg: "bg-[#effbf9]",
    text: "text-[#0b7f8f]",
  },
  SUBMITTED: {
    bg: "bg-[rgba(254,191,125,0.23)]",
    text: "text-[#ed8a22]",
  },
  APPROVED: {
    bg: "bg-[#effadb]",
    text: "text-[#80ab3c]",
  },
  REJECTED: {
    bg: "bg-[#ffcfcf]",
    text: "text-[#eb0101]",
  },
};

const StatusBadge = ({ status, label }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[90px] px-2 py-2 rounded-full text-sm font-medium font-somar ${style.bg} ${style.text}`}
    >
      {label}
    </span>
  );
};

const ActionButton = ({ label, icon, onClick, disabled, href }) => {
  const className =
    "inline-flex items-center justify-center gap-2 h-9 min-w-[120px] px-[21px] rounded-lg border border-[#bdc9c8] text-[14px] font-medium text-[#0d0d0d] tracking-[0.6px] hover:border-mainColor hover:text-mainColor transition-colors font-somar disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer bg-white";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <span>{label}</span>
        {icon}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      <span>{label}</span>
      {icon}
    </button>
  );
};

const getFileNote = (document) => {
  const note =
    document.timelineStatus?.[document.timelineStatus.length - 1]?.note;
  return note || "—";
};

const getStatusLabel = (status, t) => {
  const labels = t.raw("statuses");
  if (labels && typeof labels === "object" && labels[status]) {
    return labels[status];
  }
  return status;
};

const getDocumentName = (document, locale, t) => {
  if (document.documentType === "OTHER") {
    if (typeof document.title === "string" && document.title.trim()) {
      return document.title;
    }
    return (
      document.title?.[locale] ||
      document.title?.en ||
      document.title?.ar ||
      t("types.OTHER")
    );
  }
  const types = t.raw("types");
  if (types && typeof types === "object" && types[document.documentType]) {
    return types[document.documentType];
  }
  return document.documentType;
};

const DocumentsTable = ({
  data = {},
  loading = false,
  currentPage = 1,
  onPageChange,
  onUpload,
}) => {
  const t = useTranslations("providerProfile.onboarding.documents");
  const locale = useLocale();

  const documents = data?.nodes || [];
  const pageInfo = data?.pageInfo || {
    currentPage: currentPage || 1,
    total: documents.length,
    perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
    hasNextPage: false,
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: t("name"),
        className:
          "font-semibold text-textDark text-sm sm:text-base whitespace-nowrap font-somar align-middle",
        headerClassName: "text-start align-middle",
        render: (row) => {
          const name = getDocumentName(row, locale, t);
          const required = REQUIRED_TYPES.has(row.documentType);
          return (
            <span className="font-semibold text-[#042a30] text-sm sm:text-base font-somar">
              {name}
              {required ? <span className="text-[#ba1a1a]">*</span> : null}
            </span>
          );
        },
      },
      {
        key: "status",
        label: t("status"),
        className: "whitespace-nowrap align-middle",
        headerClassName: "text-start align-middle",
        render: (row) => (
          <StatusBadge
            status={row.status}
            label={getStatusLabel(row.status, t)}
          />
        ),
      },
      {
        key: "note",
        label: t("notes"),
        className: "font-somar text-sm align-middle",
        headerClassName: "text-start align-middle",
        render: (row) => (
          <span className="font-semibold text-sm text-[#042a30] font-somar">
            {getFileNote(row)}
          </span>
        ),
      },
      {
        key: "actions",
        label: t("actions"),
        className: "whitespace-nowrap align-middle",
        headerClassName: "text-start align-middle",
        render: (row) => {
          if (row.status === "APPROVED" && row.fileUrl) {
            return (
              <ActionButton
                label={t("show")}
                href={row.fileUrl}
                icon={<ViewIcon className="!w-4 !h-4" />}
              />
            );
          }

          if (row.status === "REJECTED") {
            return (
              <ActionButton
                label={t("reupload")}
                icon={<ReuploadIcon className="!w-3.5 !h-3.5" />}
                onClick={() =>
                  onUpload?.({
                    documentType: row.documentType,
                    title: row.title,
                    lockType: true,
                  })
                }
              />
            );
          }

          if (row.status === "PENDING" || row.status === "SUBMITTED") {
            return (
              <ActionButton
                label={t("uploadDocument")}
                icon={
                  row.status === "PENDING" ? (
                    <AddIcon className="!w-3.5 !h-3.5" />
                  ) : (
                    <UploadIcon className="!w-3.5 !h-3.5" />
                  )
                }
                onClick={() =>
                  onUpload?.({
                    documentType: row.documentType,
                    title: row.title,
                    lockType: true,
                  })
                }
              />
            );
          }

          return null;
        },
      },
    ],
    [t, locale, onUpload]
  );

  return (
    <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.16)] flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-mainColor font-somar leading-7">
          {t("title")}
        </h2>

        <button
          type="button"
          onClick={() =>
            onUpload?.({
              documentType: "OTHER",
              lockType: true,
            })
          }
          className="inline-flex items-center justify-center gap-1 bg-mainColor border-2 border-mainColor text-white font-bold text-base px-8 py-3 rounded-lg hover:bg-titleColor hover:border-titleColor active:scale-[0.98] transition-all font-somar cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span>{t("uploadFiles")}</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={documents}
        loading={loading}
        emptyState={
          <p className="text-textLight py-12 text-center text-base font-semibold font-somar">
            {t("empty")}
          </p>
        }
        pagination={
          pageInfo?.total > 0
            ? {
                pageInfo,
                currentPage,
                onPageChange,
              }
            : undefined
        }
        rowKey={(row) => row._id || `${row.documentType}-${row.createdAt}`}
      />
    </div>
  );
};

export default memo(DocumentsTable);
