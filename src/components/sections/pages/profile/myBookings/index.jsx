"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  memo,

  // useState
} from "react";

import formatCurrency from "@utils/FormatCurrency";
import formatDate from "@utils/FormateDate";

import {
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  // Paper,
  // Chip,
  // TablePagination,
  Typography,
  Badge,
  CardContent,
  Card,
} from "@mui/material";

const statusColors = {
  initiated: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const BookingsTable = ({ data }) => {
  const locale = useLocale();
  const t = useTranslations();

  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data || !data.nodes) {
    return (
      <Typography className="p-4 text-center">Loading bookings...</Typography>
    );
  }

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  return (
    <div className="w-full space-y-6">
      {/* Desktop Table */}
      <Card
        className="hidden md:block"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className=" bg-table-header">
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.schoolName")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.tripType")}
                  </th>

                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.location")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.tripName")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.date")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.price")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.bookings.header.status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className={`${
                      index != data.nodes.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-accent/50 ${
                      index % 2 === 0 ? "bg-table-row-even" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {booking.organization}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {t(`common.${booking.guestnaTripsType}`)}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {booking.cities[0].name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {booking.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(booking.bookingDay, locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {formatCurrency(booking.price)}
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        sx={{
                          background: statusColors[booking.status],
                          borderColor: statusColors[booking.status],
                          // color: "white",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "8px",
                        }}
                        className={`text-sm capitalize ${
                          statusColors[booking.status]
                        }`}
                      >
                        {t(`common.bookingStatus.${booking.status}`) ||
                          booking.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {data.nodes.map((booking) => (
          <Card
            key={booking._id}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold leading-relaxed text-foreground">
                  {booking.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatDate(booking.bookingDay, locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {booking.cities[0].name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatCurrency(booking.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {booking.organization}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    sx={{
                      background: statusColors[booking.status],
                      borderColor: statusColors[booking.status],
                      // color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "8px",
                    }}
                    className={`text-sm capitalize ${
                      statusColors[booking.status]
                    }`}
                  >
                    {t(`common.bookingStatus.${booking.status}`) ||
                      booking.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default memo(BookingsTable);
