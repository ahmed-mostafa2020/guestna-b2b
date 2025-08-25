"use client";

import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";

const BookingDetailsModal = ({
  open,
  onClose,
  booking,
  bookingDetails,
  loadingDetails,
}) => {
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
                <p className="font-medium" title={booking.description}>
                  {booking.description?.length <= 70
                    ? booking.description
                    : booking.description?.slice(0, 70) + "..."}
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
                <p className="font-medium">{booking.cities}</p>
              </div>
            </div>

            {booking.fromHour && booking.toHour && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm">⏰</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {t("profile.tables.orders.bookingDetails.time")}
                  </p>
                  <p className="font-medium">
                    {`${booking.toHour} - ${booking.fromHour}`}
                  </p>
                </div>
              </div>
            )}

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
                    {t(`common.organizationTripStatus.${booking.status}`)}
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
                <p className="font-medium text-end" dir="ltr">
                  {booking.organization?.pone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {t("profile.tables.orders.bookingDetails.bookingDate")}
                </p>
                <p className="font-medium">
                  {formatDate(booking.createdAt, locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="mt-8">
        <h3 className="text-lg font-medium pb-4">
          {t("profile.tables.orders.studentsTable.title")}
        </h3>

        {loadingDetails ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
            <p className="mt-2 text-gray-600">
              {t("profile.tables.orders.studentsTable.loading")}
            </p>
          </div>
        ) : bookingDetails?.nodes?.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {t("profile.tables.orders.studentsTable.studentName")}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {t("profile.tables.orders.studentsTable.parentName")}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {t("profile.tables.orders.studentsTable.grade")}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {t("profile.tables.orders.studentsTable.parentPhone")}
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {t("profile.tables.orders.studentsTable.nationalId")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookingDetails.nodes.map((student, index) => (
                    <tr
                      key={student._id || index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {student.child.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.parent.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.child.grade.name}
                      </td>
                      <td
                        className="px-4 py-3 text-sm text-gray-600 text-end"
                        dir="ltr"
                      >
                        {student.parent.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {student.child.nationalId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {t("profile.tables.orders.studentsTable.noData")}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button className="bg-mainColor w-full hover:bg-titleColor text-white px-6 py-2 rounded-lg font-medium transition-colors">
          {t("profile.tables.orders.bookingDetails.printReport")}
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
