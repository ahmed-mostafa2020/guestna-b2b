"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import {
  VisibilityOutlined as ViewIcon,
  DrawOutlined as SignIcon,
} from "@mui/icons-material";
import DataTable from "@components/ui/DataTable";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import getErrorMessage from "@utils/helpers/getErrorMessage";

const STATUS_STYLES = {
  DRAFT: {
    bg: "bg-[#effbf9]",
    text: "text-[#0b7f8f]",
  },
  PENDING_SIGNATURE: {
    bg: "bg-[rgba(254,191,125,0.23)]",
    text: "text-[#ed8a22]",
  },
  ACTIVE: {
    bg: "bg-[#effadb]",
    text: "text-[#80ab3c]",
  },
  EXPIRED: {
    bg: "bg-[rgba(189,201,200,0.35)]",
    text: "text-[#5f6e6d]",
  },
  TERMINATED: {
    bg: "bg-[#ffcfcf]",
    text: "text-[#eb0101]",
  },
};

const isSignable = (status) =>
  status === "DRAFT" || status === "PENDING_SIGNATURE";

const StatusBadge = ({ status, label }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;

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

const getContractName = (contract) =>
  contract.orderId ||
  contract.contractType ||
  contract._id ||
  contract.id ||
  "—";

const getContractNote = (contract) => {
  const note =
    contract.timelineStatus?.[contract.timelineStatus.length - 1]?.note;
  return note || "—";
};

const getStatusLabel = (status, t) => {
  const labels = t.raw("statuses");
  if (labels && typeof labels === "object" && labels[status]) {
    return labels[status];
  }
  return status;
};

const ContractsTable = ({
  data = {},
  loading = false,
  currentPage = 1,
  onPageChange,
  refetch,
}) => {
  const t = useTranslations();
  const tContracts = useTranslations("providerProfile.onboarding.contracts");
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [signingId, setSigningId] = useState(null);

  const contracts = data?.nodes || [];
  const pageInfo = data?.pageInfo || {
    currentPage: currentPage || 1,
    total: contracts.length,
    perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
    hasNextPage: false,
  };

  const headers = getHeaders(locale);

  const handleSign = useCallback(
    (contract) => {
      const contractId = contract?._id || contract?.id;
      if (!contractId || signingId) return;

      setSigningId(contractId);

      const config = {
        method: "post",
        url: getProxyUrl(
          `${B2B_END_POINTS.PROVIDER_PROFILE.ONBOARDING.CONTRACTS_SIGN}/${contractId}`
        ),
        headers,
        data: {},
      };

      axios
        .request(config)
        .then((response) => {
          setSigningId(null);

          if (response?.data) {
            enqueueSnackbar(
              t("providerProfile.onboarding.notifications.signSuccess"),
              { variant: "success" }
            );
            refetch?.();
          } else {
            enqueueSnackbar(
              t("providerProfile.onboarding.notifications.actionError"),
              { variant: "error" }
            );
          }
        })
        .catch((error) => {
          setSigningId(null);
          console.error("Onboarding contract sign error:", {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
          });
          enqueueSnackbar(
            getErrorMessage(
              error,
              t,
              "providerProfile.onboarding.notifications.actionError"
            ),
            { variant: "error" }
          );
        });
    },
    [signingId, headers, enqueueSnackbar, t, refetch]
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: tContracts("name"),
        className:
          "font-semibold text-textDark text-sm sm:text-base whitespace-nowrap font-somar align-middle",
        headerClassName: "text-start align-middle",
        render: (row) => (
          <span className="font-semibold text-[#042a30] text-sm sm:text-base font-somar">
            {getContractName(row)}
          </span>
        ),
      },
      {
        key: "status",
        label: tContracts("status"),
        className: "whitespace-nowrap align-middle",
        headerClassName: "text-start align-middle",
        render: (row) => (
          <StatusBadge
            status={row.status}
            label={getStatusLabel(row.status, tContracts)}
          />
        ),
      },
      {
        key: "note",
        label: tContracts("notes"),
        className: "font-somar text-sm align-middle",
        headerClassName: "text-start align-middle",
        render: (row) => (
          <span className="font-semibold text-sm text-[#042a30] font-somar">
            {getContractNote(row)}
          </span>
        ),
      },
      {
        key: "actions",
        label: tContracts("actions"),
        className: "whitespace-nowrap align-middle",
        headerClassName: "text-start align-middle",
        render: (row) => {
          const id = row._id || row.id;
          const isSigning = signingId === id;
          const attachment = Array.isArray(row.attachments)
            ? row.attachments[0]
            : null;

          if (isSignable(row.status)) {
            return (
              <ActionButton
                label={isSigning ? tContracts("signing") : tContracts("sign")}
                disabled={!!signingId}
                icon={
                  isSigning ? (
                    <CircularProgress size={14} sx={{ color: "#0d0d0d" }} />
                  ) : (
                    <SignIcon className="!w-4 !h-4" />
                  )
                }
                onClick={() => handleSign(row)}
              />
            );
          }

          if (attachment) {
            return (
              <ActionButton
                label={tContracts("show")}
                href={attachment}
                icon={<ViewIcon className="!w-4 !h-4" />}
              />
            );
          }

          return null;
        },
      },
    ],
    [tContracts, signingId, handleSign]
  );

  return (
    <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.16)] flex flex-col gap-8">
      <h2 className="text-xl sm:text-2xl font-bold text-mainColor font-somar leading-7 self-start">
        {tContracts("title")}
      </h2>

      <DataTable
        columns={columns}
        data={contracts}
        loading={loading}
        emptyState={
          <p className="text-textLight py-12 text-center text-base font-semibold font-somar">
            {tContracts("empty")}
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
        rowKey={(row) => row._id || row.orderId}
      />
    </div>
  );
};

export default memo(ContractsTable);
