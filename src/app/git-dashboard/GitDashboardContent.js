"use client";

import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";

const GitDashboardContent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/git-control");
      const data = await res.json();

      if (!res.ok) {
        enqueueSnackbar(data.error || "Failed to fetch branches", {
          variant: "error",
        });
        return;
      }

      setBranches(data.branches || []);
      setCurrentBranch(data.currentBranch || "");
    } catch (error) {
      enqueueSnackbar("Network error while fetching branches", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleAction = async (action, branchName) => {
    const key = `${action}-${branchName}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const res = await fetch("/api/git-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, branchName }),
      });

      const data = await res.json();

      if (data.success) {
        const message =
          action === "checkout"
            ? `Switched to branch: ${branchName}`
            : `Pulled latest from: ${branchName}`;

        enqueueSnackbar(message, { variant: "success" });

        if (data.currentBranch) {
          setCurrentBranch(data.currentBranch);
        }

        if (data.stdout) {
          enqueueSnackbar(data.stdout, {
            variant: "info",
            autoHideDuration: 5000,
          });
        }
      } else {
        enqueueSnackbar(data.error || data.stderr || "Action failed", {
          variant: "error",
          autoHideDuration: 6000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Network error while executing action", {
        variant: "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-mainColor rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Git Dashboard
                </h1>
                {currentBranch && (
                  <p className="text-sm text-gray-500">
                    Current branch:{" "}
                    <span className="font-semibold text-mainColor">
                      {currentBranch}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search branches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent w-full sm:w-64"
                />
              </div>

              <button
                onClick={fetchBranches}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-mainColor text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Branches</p>
            <p className="text-2xl font-bold text-gray-900">
              {branches.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Current Branch</p>
            <p className="text-2xl font-bold text-mainColor truncate">
              {currentBranch || "—"}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Filtered Results</p>
            <p className="text-2xl font-bold text-gray-900">
              {filteredBranches.length}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-mainColor border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading branches...</p>
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">No branches found</p>
            {searchTerm && (
              <p className="text-gray-400 text-sm mt-1">
                Try a different search term
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Branch Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBranches.map((branch, index) => {
                    const isCurrent = branch.name === currentBranch;
                    const checkoutLoading =
                      actionLoading[`checkout-${branch.name}`];
                    const pullLoading = actionLoading[`pull-${branch.name}`];

                    return (
                      <tr
                        key={`${branch.name}-${index}`}
                        className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                          isCurrent ? "bg-emerald-50/50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 text-sm">
                              {branch.name}
                            </span>
                            {branch.protected && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                                Protected
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isCurrent ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              Active
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                handleAction("checkout", branch.name)
                              }
                              disabled={checkoutLoading || isCurrent}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                isCurrent
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-mainColor text-white hover:opacity-90 disabled:opacity-50"
                              }`}
                            >
                              {checkoutLoading ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                  />
                                </svg>
                              )}
                              Checkout
                            </button>

                            <button
                              onClick={() => handleAction("pull", branch.name)}
                              disabled={pullLoading}
                              className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                              {pullLoading ? (
                                <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                              )}
                              Pull
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {filteredBranches.map((branch, index) => {
                const isCurrent = branch.name === currentBranch;
                const checkoutLoading =
                  actionLoading[`checkout-${branch.name}`];
                const pullLoading = actionLoading[`pull-${branch.name}`];

                return (
                  <div
                    key={`mobile-${branch.name}-${index}`}
                    className={`bg-white rounded-xl border p-4 ${
                      isCurrent
                        ? "border-emerald-300 bg-emerald-50/30"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {branch.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {isCurrent && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              Active
                            </span>
                          )}
                          {branch.protected && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                              Protected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction("checkout", branch.name)}
                        disabled={checkoutLoading || isCurrent}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          isCurrent
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-mainColor text-white hover:opacity-90 disabled:opacity-50"
                        }`}
                      >
                        {checkoutLoading ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : null}
                        Checkout
                      </button>

                      <button
                        onClick={() => handleAction("pull", branch.name)}
                        disabled={pullLoading}
                        className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {pullLoading ? (
                          <span className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                        ) : null}
                        Pull
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default GitDashboardContent;
