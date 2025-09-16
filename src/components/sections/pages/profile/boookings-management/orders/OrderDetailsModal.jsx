import { useTranslations } from "next-intl";
import { memo } from "react";

import formatDate from "@utils/FormateDate";
import {
  locationIcon,
  timeIcon,
  dateIcon,
  profileIcon,
  walletIcon,
  ticketsIcon,
  schoolIcon,
} from "@assets/svg";
import { CircularProgress } from "@mui/material";
import formatCurrency from "@utils/FormatCurrency";

const OrderDetailsModal = ({ orderId, orderDetails, loading }) => {
  const t = useTranslations();

  if (loading || !orderDetails) {
    return (
      <div className="p-8 bg-white rounded-xl mx-auto w-[70%] flex flex-col items-center justify-center min-h-[200px]">
        <CircularProgress size={40} color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white mx-auto w-[75%] rounded-xl mb-5">
      <h2 className="text-center text-2xl font-semibold">
        {t("profile.tables.ordersInfo.orderDetails.title")}{" "}
        {orderDetails?.trip?.name || orderDetails?._id}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trip Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">
            {t("profile.tables.ordersInfo.orderDetails.tripInfo")}
          </h3>

          <div className=" flex flex-wrap gap-3 border-2 border-border rounded-lg p-3">
            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {ticketsIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.ordersInfo.orderDetails.tripType")}:
              </p>
              <p className="font-medium">
                {t(`common.${orderDetails?.tripType}`)}
              </p>
            </div>

            {orderDetails?.city?.name && (
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                {locationIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.ordersInfo.orderDetails.location")}:
                </p>
                <p className="font-medium">{orderDetails?.city?.name}</p>
              </div>
            )}

            {orderDetails?.category?.name && (
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                {profileIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.ordersInfo.orderDetails.category")}:
                </p>
                <p className="font-medium">{orderDetails?.category?.name}</p>
              </div>
            )}
            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {dateIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.ordersInfo.orderDetails.tripDate")}:
              </p>
              <p className="font-medium">
                {orderDetails?.day &&
                  formatDate(orderDetails.day, "ar", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {ticketsIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.ordersInfo.orderDetails.status")}:
              </p>
              <span className=" text-sm font-medium">
                {orderDetails?.status &&
                  t(`common.organizationTripStatus.${orderDetails.status}`)}
              </span>
            </div>

            {orderDetails?.basePrice && (
              <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                {walletIcon}
                <p className="text-sm text-gray-600">
                  {t("profile.tables.ordersInfo.orderDetails.basePrice")}:
                </p>
                <span className=" text-sm font-medium">
                  {formatCurrency(orderDetails?.basePrice)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Booking Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">
            {t("profile.tables.ordersInfo.orderDetails.bookingInfo")}
          </h3>

          <div className="space-y-4 border-2 border-border rounded-lg p-3">
            <div className="flex flex-wrap items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {profileIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.ordersInfo.orderDetails.orderId")}:
              </p>
              <p className="font-medium font-mono">{orderId}</p>
            </div>

            <div className="flex items-center gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
              {ticketsIcon}
              <p className="text-sm text-gray-600">
                {t("profile.tables.ordersInfo.orderDetails.availableSeats")}:
              </p>
              <p className="font-medium">{orderDetails?.availableSeats}</p>
            </div>

            {orderDetails?.note && (
              <div className="flex flex-col gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                <p className="text-sm text-gray-600">
                  {t("profile.tables.ordersInfo.orderDetails.note")}:
                </p>
                <p className="font-medium">{orderDetails?.note}</p>
              </div>
            )}

            {orderDetails.academicStages?.length > 0 && (
              <div className="flex flex-col gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                <div className="flex items-center gap-1">
                  {schoolIcon}
                  <p className="text-sm text-gray-600">
                    {t("profile.tables.ordersInfo.orderDetails.academicStages")}
                    :
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {orderDetails?.academicStages?.map((stage, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                    >
                      {typeof stage === "string" ? stage : stage?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {orderDetails?.services?.length > 0 && (
              <div className="flex flex-col gap-1 rounded-lg p-2 border border-border shadow-card w-fit">
                <div className="flex items-center gap-1">
                  {schoolIcon}
                  <p className="text-sm text-gray-600">
                    {t("profile.tables.ordersInfo.orderDetails.services")}:
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {orderDetails?.services?.map((service, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                    >
                      {typeof service === "string" ? service : service?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(OrderDetailsModal);
