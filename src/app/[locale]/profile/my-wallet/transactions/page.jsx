"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { KeyboardArrowDown, Print } from "@mui/icons-material";

const TransactionsPage = () => {
  const t = useTranslations();

  // Mock data for balances
  const balanceData = {
    totalBalance: 1250,
    availableBalance: 1250,
    holdBalance: 1250,
  };

  // Mock data for transactions
  const [transactions] = useState([
    {
      id: 1,
      operationName: "رحلة العلا",
      date: "2/15/2024",
      referenceNumber: "BK001",
      amount: 4500,
      status: "completed",
    },
    {
      id: 2,
      operationName: "رحلة المتحف الوطني",
      date: "2/15/2024",
      referenceNumber: "BK001",
      amount: 4500,
      status: "completed",
    },
    {
      id: 3,
      operationName: "رحلة العلا التاريخية",
      date: "2/15/2024",
      referenceNumber: "BK001",
      amount: -2500,
      status: "completed",
    },
    {
      id: 4,
      operationName: "رحلة المتحف الوطني",
      date: "2/15/2024",
      referenceNumber: "BK001",
      amount: 4500,
      status: "processing",
    },
    {
      id: 5,
      operationName: "رحلة المتحف الوطني",
      date: "2/15/2024",
      referenceNumber: "BK001",
      amount: 4500,
      status: "pending",
    },
    {
      id: 6,
      operationName: "رحلة المتحف الوطني",
      date: "2/15/2024",
      referenceNumber: "BK001",
      amount: 4500,
      status: "processing",
    },
    {
      id: 7,
      operationName: "رحلة المتحف الوطني",
      date: "2/15/2024",
      referenceNumber: "BK001",
      amount: 4500,
      status: "completed",
    },
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    operationName: "",
    transactionDate: "",
    status: "",
  });

  // Status configuration
  const statusConfig = {
    completed: {
      label: "مكتمل",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    processing: {
      label: "قيد المعالجة",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    pending: {
      label: "معلقة",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  // Format currency
  const formatCurrency = (amount) => {
    const formattedAmount = Math.abs(amount).toLocaleString("ar-SA");
    return `${amount < 0 ? "-" : ""}${formattedAmount} ريال`;
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle print report
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Title */}
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("profile.myWallet.title")}
          </h1>
        </div>

        {/* Balance Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-right">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("profile.myWallet.totalBalance")}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {balanceData.totalBalance.toLocaleString("ar-SA")} ريال
              </p>
            </div>
          </div>

          {/* Available Balance Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-right">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("profile.myWallet.availableBalance")}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {balanceData.availableBalance.toLocaleString("ar-SA")} ريال
              </p>
            </div>
          </div>

          {/* Hold Balance Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-right">
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {t("profile.myWallet.holdBalance")}
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {balanceData.holdBalance.toLocaleString("ar-SA")} ريال
              </p>
            </div>
          </div>
        </div>

        {/* Actions and Filters Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Print Report Button */}
            <div className="lg:flex-shrink-0">
              <button
                onClick={handlePrintReport}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Print className="w-5 h-5" />
                {t("profile.myWallet.printReport")}
              </button>
            </div>

            {/* Filters Section */}
            <div className="flex-1 lg:flex lg:flex-col lg:items-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center lg:text-right">
                {t("profile.myWallet.filterTransactions")}
              </h3>
              <div className="flex flex-col lg:flex-row gap-4 w-full">
                {/* Operation Name Filter */}
                <div className="relative flex-1">
                  <select
                    value={filters.operationName}
                    onChange={(e) =>
                      handleFilterChange("operationName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">
                      {t("profile.myWallet.transactionName")}
                    </option>
                    <option value="trip1">رحلة العلا</option>
                    <option value="trip2">رحلة المتحف الوطني</option>
                    <option value="trip3">رحلة العلا التاريخية</option>
                  </select>
                  <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Transaction Date Filter */}
                <div className="relative flex-1">
                  <select
                    value={filters.transactionDate}
                    onChange={(e) =>
                      handleFilterChange("transactionDate", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">
                      {t("profile.myWallet.transactionDate")}
                    </option>
                    <option value="2024-02-15">2/15/2024</option>
                    <option value="2024-02-14">2/14/2024</option>
                    <option value="2024-02-13">2/13/2024</option>
                  </select>
                  <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="relative flex-1">
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">
                      {t("profile.myWallet.transactionStatus")}
                    </option>
                    <option value="completed">مكتمل</option>
                    <option value="processing">قيد المعالجة</option>
                    <option value="pending">معلقة</option>
                  </select>
                  <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 text-right">
              {t("profile.myWallet.transactions")}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.transactionName")}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.transactionDate")}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.referenceNumber")}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.transactionAmount")}
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {t("profile.myWallet.transactionStatus")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.operationName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {transaction.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900">
                        {transaction.referenceNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div
                        className={`text-sm font-medium ${
                          transaction.amount < 0
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                          statusConfig[transaction.status].className
                        }`}
                      >
                        {statusConfig[transaction.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
