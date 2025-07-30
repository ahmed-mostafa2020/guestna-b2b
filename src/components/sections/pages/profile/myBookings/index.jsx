"use client";

import { memo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination,
  Typography,
} from "@mui/material";

const statusColors = {
  initiated: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

const BookingsTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  if (!data || !data.nodes) {
    return (
      <Typography className="p-4 text-center">Loading bookings...</Typography>
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="p-4">
      <TableContainer component={Paper} className="rounded-lg shadow-md">
        <Table aria-label="bookings table">
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold">Booking ID</TableCell>
              <TableCell className="font-bold">Date</TableCell>
              <TableCell className="font-bold">Activity</TableCell>
              <TableCell className="font-bold">Organization</TableCell>
              <TableCell className="font-bold">City</TableCell>
              <TableCell className="font-bold">Category</TableCell>
              <TableCell className="font-bold">Type</TableCell>
              <TableCell className="font-bold">Quantity</TableCell>
              <TableCell className="font-bold">Price</TableCell>
              <TableCell className="font-bold">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.nodes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((booking) => (
                <TableRow key={booking._id} hover className="hover:bg-gray-50">
                  <TableCell className="text-sm">
                    {booking._id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {new Date(booking.bookingDay).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">{booking.name}</TableCell>
                  <TableCell>{booking.organization}</TableCell>
                  <TableCell>{booking.cities?.[0]?.name || "N/A"}</TableCell>
                  <TableCell>{booking.categories}</TableCell>
                  <TableCell>{booking.guestnaTripsType}</TableCell>
                  <TableCell>{booking.quantity}</TableCell>
                  <TableCell className="font-medium">
                    {booking.price.toLocaleString()} SAR
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.status}
                      className={`${
                        statusColors[booking.status] || "bg-gray-100"
                      } capitalize`}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.pageInfo.total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className="border-t"
        />
      </TableContainer>
    </div>
  );
};

export default memo(BookingsTable);
