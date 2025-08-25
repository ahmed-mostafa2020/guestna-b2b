"use client";

import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";

const BookingDetailsModal = ({ open, onClose, booking }) => {
  const locale = useLocale();
  const t = useTranslations();

  if (!booking) return null;

  return (
    <div className="space-y-6 p-6 bg-white mx-auto w-[75%] rounded-xl">
      <h2 className="text-center text-2xl font-semibold">
        {t("profile.tables.orders.bookingDetails.title")} {booking.name}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trip Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">
            {t("profile.tables.orders.bookingDetails.tripInfo")}
          </h3>

          <div className="space-y-4 border-2 border-border rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm">🏛️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.tripDescription")}
                </p>
                <p className="font-medium">
                  {booking.description ||
                    booking.name ||
                    "زيارة تعليمية للمتحف الوطني"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm">📍</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.location")}
                </p>
                <p className="font-medium">
                  {booking.location || booking.city || "الرياض"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm">⏰</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.time")}
                </p>
                <p className="font-medium">
                  {booking.fromHour &&
                    booking.toHour &&
                    `${booking.toHour} - ${booking.fromHour}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("profile.tables.orders.bookingDetails.tripStartDate")}
                  </p>
                  <p className="font-medium">
                    {booking.day &&
                      formatDate(booking.day, locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 ">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("profile.tables.orders.bookingDetails.tripEndDate")}
                  </p>
                  <p className="font-medium">
                    {booking.day && booking.duration > 1
                      ? formatDate(
                          new Date(
                            new Date(booking.day).getTime() +
                              booking.duration * 24 * 60 * 60 * 1000
                          ),
                          locale,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : formatDate(booking.day, locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm">📅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("profile.tables.orders.bookingDetails.bookingStatus")}
                  </p>
                  <p className="font-medium">
                    {t(`common.organizationTripStatus.${booking.status}`) ||
                      "مؤكد"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm">💰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("profile.tables.orders.bookingDetails.fees")}
                  </p>
                  <p className="font-medium">
                    {booking.price ? formatCurrency(booking.price) : "120 ريال"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* School Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">
            {t("profile.tables.orders.bookingDetails.schoolInfo")}
          </h3>

          <div className="space-y-4 border-2 border-border rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🏫</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.schoolName")}
                </p>
                <p className="font-medium">{booking.organization?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">👨‍🏫</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.contactPerson")}
                </p>
                <p className="font-medium">{booking.organization?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📞</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.phoneNumber")}
                </p>
                <p className="font-medium">{booking.organization?.pone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button className="bg-mainColor w-full hover:bg-titleColor text-white px-6 py-2 rounded-lg font-medium transition-colors">
          {t("profile.tables.orders.bookingDetails.printReport")}
        </button>
        {/* <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          {t("profile.tables.orders.bookingDetails.sendDetails")}
        </button> */}
      </div>
    </div>
  );
};

export default BookingDetailsModal;
