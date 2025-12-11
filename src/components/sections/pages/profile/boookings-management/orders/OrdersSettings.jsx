"use client";

import { useLocale, useTranslations } from "next-intl";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { Card, CardContent, CircularProgress } from "@mui/material";
import { memo, useState, useCallback } from "react";
import EditTripSettingsForm from "@components/forms/EditTripSettingsForm";
import ErrorComponent from "@feedback/error/ErrorComponent";
import { actionsIcon } from "@assets/svg";
import formatNumbersUint from "@/src/utils/FormatNumbersUint";

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

const OrdersSettings = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  // Fetch trip settings data
  const { data, isLoading, error, refetch } = useFetchData(
    B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.SETTINGS.ALL_TRIPS,
    {},
    {
      method: "POST",
      body: {},
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
    <div className="flex flex-col gap-4 w-full bg-white rounded-2xl p-4 lg:p-8 shadow-card">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 lg:mb-8">
        <h2 className="text-lg font-medium lg:text-xl text-mainColor">
          {t("profile.tables.orders.settingsTable.title")}
        </h2>

        {/* School Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor min-w-[250px]">
            <option value="">
              {t("profile.tables.orders.settingsTable.selectSchool")}
            </option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <Card
        className="hidden md:block"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        {isLoading ? (
          <div className="w-full min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <CircularProgress size={50} sx={{ color: "var(--color-main)" }} />
              <p className="text-sm text-gray-500">
                {t("profile.tables.orders.settingsTable.loading")}
              </p>
            </div>
          </div>
        ) : settingsData.length === 0 ? (
          <div className="w-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">
              {t("profile.tables.orders.settingsTable.noData")}
            </p>
          </div>
        ) : (
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-table-header border-b-2 border-tableRowBorder">
                    <th className="px-4 py-4 font-semibold text-start">
                      {t("profile.tables.orders.settingsTable.school")}
                    </th>
                    <th className="px-4 py-4 font-semibold text-start">
                      {t("profile.tables.orders.settingsTable.track")}
                    </th>
                    <th className="px-4 py-4 font-semibold text-start">
                      {t("profile.tables.orders.settingsTable.maxTrips")}
                    </th>
                    <th className="px-4 py-4 font-semibold text-start">
                      {t("profile.tables.orders.settingsTable.currentTrips")}
                    </th>
                    <th className="px-4 py-4 font-semibold text-start">
                      {t("profile.tables.orders.settingsTable.status")}
                    </th>
                    <th className="px-4 py-4 font-semibold text-start">
                      {t("profile.tables.orders.settingsTable.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settingsData.map((item, index) => {
                    const statusInfo = getStatusInfo(
                      item.tripsCount,
                      item.maximumNumberTrips,
                      t
                    );
                    const trackInfo = item.track;
                    const trackDisplay =
                      trackInfo?.educationSystem?.name || "-";

                    return (
                      <tr
                        key={`${item._id}-${index}`}
                        className={`${
                          index !== settingsData.length - 1 &&
                          "border-b border-table-border"
                        } transition-colors hover:bg-gray-50`}
                      >
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          <div
                            className="truncate"
                            title={item.organization?.name}
                          >
                            {item.organization?.name || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          <div className="truncate" title={trackDisplay}>
                            {trackDisplay}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          {item.maximumNumberTrips}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-foreground">
                          {item.tripsCount}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-sm font-medium ${statusInfo.className}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-2 text-mainColor hover:bg-mainColor/10 rounded-lg transition-colors"
                            title={t("links.edit")}
                          >
                            {actionsIcon}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="w-full min-h-[200px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <CircularProgress size={40} sx={{ color: "var(--color-main)" }} />
              <p className="text-sm text-gray-500">
                {t("profile.tables.orders.settingsTable.loading")}
              </p>
            </div>
          </div>
        ) : settingsData.length === 0 ? (
          <div className="w-full min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">
              {t("profile.tables.orders.settingsTable.noData")}
            </p>
          </div>
        ) : (
          settingsData.map((item, index) => {
            const statusInfo = getStatusInfo(
              item.tripsCount,
              item.maximumNumberTrips,
              t
            );
            const trackInfo = item.track;
            const trackDisplay = trackInfo?.educationSystem?.name || "-";

            return (
              <Card
                key={`${item._id}-${index}`}
                className="transition-shadow shadow-md hover:shadow-lg"
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <CardContent className="p-4 space-y-4">
                  {/* Header with School Name and Status */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-200">
                    <h3 className="text-base font-bold leading-tight text-foreground flex-1 min-w-0">
                      {item.organization?.name || "-"}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Data Grid */}
                  <div className="space-y-3 text-sm">
                    {/* Track */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-gray-600 flex-shrink-0">
                        {t("profile.tables.orders.settingsTable.track")}:
                      </span>
                      <span className="text-foreground text-end font-medium">
                        {trackDisplay}
                      </span>
                    </div>

                    {/* Max Trips */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-gray-600 flex-shrink-0">
                        {t("profile.tables.orders.settingsTable.maxTrips")}:
                      </span>
                      <span className="text-foreground text-end font-medium">
                        {item.maximumNumberTrips}
                      </span>
                    </div>

                    {/* Current Trips */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-gray-600 flex-shrink-0">
                        {t("profile.tables.orders.settingsTable.currentTrips")}:
                      </span>
                      <span className="text-foreground text-end font-medium">
                        {item.tripsCount}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="font-medium text-gray-600 flex-shrink-0">
                        {t("links.edit")}
                      </span>

                      <button onClick={() => handleEditClick(item)}>
                        {actionsIcon}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

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

export default memo(OrdersSettings);
