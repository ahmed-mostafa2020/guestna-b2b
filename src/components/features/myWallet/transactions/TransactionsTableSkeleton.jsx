"use client";

import TableSkeleton from "@components/ui/TableSkeleton";

// Transactions table has 7 columns
const TransactionsTableSkeleton = () => (
  <TableSkeleton columns={7} rows={5} showTitle mobileRows={3} />
);

export default TransactionsTableSkeleton;
