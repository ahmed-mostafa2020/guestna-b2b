"use client";

import { useLocale, useTranslations } from "next-intl";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { Card, CardContent, CircularProgress } from "@mui/material";
import { memo, useState, useCallback } from "react";
import EditTripSettingsForm from "@components/forms/EditTripSettingsForm";
import formatNumbersUint from "@utils/FormatNumbersUint";
import ErrorComponent from "@feedback/error/ErrorComponent";
import DataTable from "@components/common/DataTable";
import { actionsIcon } from "@assets/svg";
import { CONSTANT_VALUES } from "@constants/constantValues";
import OrdersTableFilter from "./OrdersTableFilter";

const getStatusInfo = (tripsCount, maximumNumberTrips, t) => {
  const remaining = maximumNumberTrips - tripsCount;

  if (remaining <= 0) {
    return {
      label: t("profile.tables.orders.settingsTable.completed"),
      className: "px-4 py-2 rounded-[45px] bg-green-100 text-green-800",
    };
  }

  const tripWord = formatNumbersUint(
    remaining,
    t("profile.tables.orders.settingsTable.availableTrip"),
    t("profile.tables.orders.settingsTable.availableTrips")
  );

  return {
    label: tripWord,
    className: "px-4 py-2 rounded-[45px] bg-yellow-100 text-yellow-800",
  };
};

const OrdersSettingsTable = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const[filter,setFilter]=useState({})

  // Handle opening edit modal
  const handleEditClick = useCallback((item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  }, []);

  // Handle closing edit modal
  const handleCloseModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedItem(null);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Fetch trip settings data
  const { data, isLoading, error, refetch } = useFetchData(
    B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.SETTINGS.ALL_TRIPS,
    { page: currentPage, perPage: CONSTANT_VALUES.TABLE_PER_PAGE },
    {
      method: "POST",
      body: { page: currentPage, perPage: CONSTANT_VALUES.TABLE_PER_PAGE ,filter},
      lang: locale,
    }
  );

  const settingsData = data?.nodes || [];

  // Error state display
  if (error) {
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error?.response?.data?.message}
        notFoundPage={false}
        padding={false}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full bg-white rounded-2xl py-4 px-3 shadow-card">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-8">
        
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-medium lg:text-2xl !mb-4 !lg:mb-8 text-mainColor">
            {t("profile.tables.orders.settingsTable.title")}
          </h2>

          <div className="self-end min-w-[350px]">
            <OrdersTableFilter filter={filter} setFilter={setFilter} />
          </div>
        </div>

        {/* School Filter Dropdown */}
        {/* Add school filter dropdown */}
      </div>

      <DataTable
        columns={[
          {
            key: "school",
            label: t("profile.tables.orders.settingsTable.school"),
            className: "font-medium text-foreground",
            render: (row) => <div className="truncate" title={row.organization?.name}>{row.organization?.name || "-"}</div>,
          },
          {
            key: "track",
            label: t("profile.tables.orders.settingsTable.track"),
            className: "font-medium text-foreground",
            render: (row) => {
              const trackDisplay = row.track?.educationSystem?.name || "-";
              return <div className="truncate" title={trackDisplay}>{trackDisplay}</div>;
            },
          },
          {
            key: "maxTrips",
            label: t("profile.tables.orders.settingsTable.maxTrips"),
            className: "font-medium text-foreground",
            render: (row) => row.maximumNumberTrips,
          },
          {
            key: "currentTrips",
            label: t("profile.tables.orders.settingsTable.currentTrips"),
            className: "font-medium text-foreground",
            render: (row) => row.tripsCount,
          },
          {
            key: "status",
            label: t("profile.tables.orders.settingsTable.status"),
            render: (row) => {
              const statusInfo = getStatusInfo(row.tripsCount, row.maximumNumberTrips, t);
              return <span className={`text-sm font-medium ${statusInfo.className}`}>{statusInfo.label}</span>;
            },
          }
        ]}
        data={settingsData}
        loading={isLoading}
        actionsLabel={t("profile.tables.orders.settingsTable.actions")}
        rowActions={(row) => (
          <button
            onClick={() => handleEditClick(row)}
            className="p-2 text-mainColor hover:bg-mainColor/10 rounded-lg transition-colors flex items-center justify-center m-auto"
            title={t("links.edit")}
          >
            {actionsIcon}
          </button>
        )}
        pagination={
          data?.pageInfo
            ? {
                currentPage,
                pageInfo: data.pageInfo,
                onPageChange: handlePageChange,
              }
            : undefined
        }
      />

      {/* Edit Modal */}
      {editModalOpen && selectedItem && (
        <EditTripSettingsForm
          item={selectedItem}
          onClose={handleCloseModal}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default memo(OrdersSettingsTable);
