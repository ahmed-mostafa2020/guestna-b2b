"use client";

import { memo, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { VisibilityOutlined as ViewIcon } from "@mui/icons-material";
import DataTable from "@components/ui/DataTable";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { setOnboardingContractsPage } from "@store/providerOnboarding/onboardingContractsSlice";

const STATUS_STYLES = {
  DRAFT: {
    bg: "bg-status-info-bg",
    text: "text-status-info-fg",
  },
  PENDING_SIGNATURE: {
    bg: "bg-status-warning-bg",
    text: "text-status-warning-fg",
  },
  ACTIVE: {
    bg: "bg-status-success-bg",
    text: "text-status-success-fg",
  },
  EXPIRED: {
    bg: "bg-status-neutral-bg",
    text: "text-status-neutral-fg",
  },
  TERMINATED: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
  },
};

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

const ContractsTable = () => {
  const tContracts = useTranslations("providerProfile.onboarding.contracts");
  const dispatch = useDispatch();
  const {
    data,
    page: currentPage,
    loading,
  } = useSelector((state) => state.onboardingContracts);

  const contractsData = data || {};
  const isLoading = loading === "loading";

  const onPageChange = useCallback(
    (page) => {
      dispatch(setOnboardingContractsPage(page));
    },
    [dispatch]
  );

  const contracts = contractsData?.nodes || [];
  const pageInfo = contractsData?.pageInfo || {
    currentPage: currentPage || 1,
    total: contracts.length,
    perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
    hasNextPage: false,
  };

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
          const pdfUrl = row.pdfUrl;

          if (pdfUrl) {
            return (
              <ActionButton
                label={tContracts("show")}
                href={pdfUrl}
                icon={<ViewIcon className="!w-4 !h-4" />}
              />
            );
          }

          return null;
        },
      },
    ],
    [tContracts]
  );

  return (
    <div className="bg-white px-3 py-4 sm:px-4 sm:py-5 rounded-2xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.16)] flex flex-col gap-8">
      <h2 className="text-xl sm:text-2xl font-bold text-mainColor font-somar leading-7 self-start">
        {tContracts("title")}
      </h2>

      <DataTable
        columns={columns}
        data={contracts}
        loading={isLoading}
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
