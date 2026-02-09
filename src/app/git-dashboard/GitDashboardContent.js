"use client";

import { useState, useEffect, useCallback } from "react";
import { useSnackbar } from "notistack";
import Image from "next/image";
import Link from "next/link";

// Skeleton pulse block
const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const GitDashboardContent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [lastMergeInfo, setLastMergeInfo] = useState(null);
  const [unmergeLoading, setUnmergeLoading] = useState(false);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      // Cache-bust: append timestamp so browser + Next.js never serve stale data
      const res = await fetch(`/api/git-control?t=${Date.now()}`);
      const data = await res.json();

      if (!res.ok) {
        enqueueSnackbar(data.error || "Failed to fetch branches", {
          variant: "error",
        });
        return;
      }

      setBranches(data.branches || []);
      setLastMergeInfo(data.lastMergeInfo || null);
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

  const handleMergeToMain = async (branchName) => {
    if (
      !confirm(
        `Merge "${branchName}" into main and push? This will trigger a Vercel deployment.`
      )
    ) {
      return;
    }

    setActionLoading((prev) => ({ ...prev, [branchName]: true }));

    try {
      const res = await fetch("/api/git-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "merge_to_main", branchName }),
      });

      const data = await res.json();

      if (data.success) {
        enqueueSnackbar(
          `Merged ${branchName} into main & pushed — Vercel deploying!`,
          { variant: "success" }
        );

        if (data.stdout) {
          enqueueSnackbar(data.stdout, {
            variant: "info",
            autoHideDuration: 5000,
          });
        }

        fetchBranches();
      } else if (res.status === 409) {
        alert(
          `⚠️ Merge Conflict\n\nCannot merge "${branchName}" into main due to conflicts.\n\nPlease inform the developer to:\n1. Pull the latest main branch\n2. Merge main into "${branchName}" locally\n3. Resolve all conflicts\n4. Push the resolved branch\n5. Then try merging again from this dashboard`
        );
        enqueueSnackbar(
          `Conflict: "${branchName}" has conflicts with main. Developer must resolve them first.`,
          { variant: "error", autoHideDuration: 8000 }
        );
      } else {
        enqueueSnackbar(data.error || data.stderr || "Merge failed", {
          variant: "error",
          autoHideDuration: 6000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Network error while merging", {
        variant: "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [branchName]: false }));
    }
  };

  const handleUnmerge = async () => {
    if (
      !confirm(
        "Revert the last merge on main and push? This will trigger a Vercel redeployment."
      )
    ) {
      return;
    }

    setUnmergeLoading(true);

    try {
      const res = await fetch("/api/git-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unmerge" }),
      });

      const data = await res.json();

      if (data.success) {
        enqueueSnackbar(
          `Unmerged: ${data.revertedMerge || "last merge reverted"} — Vercel redeploying!`,
          { variant: "success" }
        );

        if (data.stdout) {
          enqueueSnackbar(data.stdout, {
            variant: "info",
            autoHideDuration: 5000,
          });
        }

        fetchBranches();
      } else {
        enqueueSnackbar(data.error || "Unmerge failed", {
          variant: "error",
          autoHideDuration: 6000,
        });
      }
    } catch (error) {
      enqueueSnackbar("Network error while unmerging", {
        variant: "error",
      });
    } finally {
      setUnmergeLoading(false);
    }
  };

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort: main first, then alphabetical
  const sortedBranches = [...filteredBranches].sort((a, b) => {
    if (a.name === "main") return -1;
    if (b.name === "main") return 1;
    return a.name.localeCompare(b.name);
  });

  // Skeleton UI matching the page layout
  const renderSkeleton = () => (
    <>
      {/* Last Merge Banner Skeleton */}
      <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3.5 w-64 max-w-full" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 mb-6">
        {[1].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 space-y-2"
          >
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="px-6 py-4 flex items-center justify-between border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-40" />
              {i === 1 && <Skeleton className="h-5 w-16 rounded-full" />}
            </div>
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="md:hidden flex flex-col gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-36" />
              {i === 1 && <Skeleton className="h-5 w-16 rounded-full" />}
            </div>
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/" aria-label="Go to homepage">
                <Image
                  src="/logo.png"
                  alt="Guestna Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Git Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Merge branches into main to deploy
                </p>
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
        {loading ? (
          renderSkeleton()
        ) : (
          <>
            {/* Latest Activity on Main Banner */}
            {lastMergeInfo && (
              <div className="mb-6 bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      lastMergeInfo.isMerge ? "bg-purple-100" : "bg-blue-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        lastMergeInfo.isMerge
                          ? "text-purple-600"
                          : "text-blue-600"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          lastMergeInfo.isMerge
                            ? "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                            : "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        }
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {lastMergeInfo.isMerge
                        ? "Latest on Main — Merge"
                        : "Latest on Main — Push"}
                    </p>
                    <p className="text-sm text-gray-600 break-all">
                      {lastMergeInfo.branch ? (
                        <>
                          Branch{" "}
                          <span className="font-semibold text-purple-600">
                            {lastMergeInfo.branch}
                          </span>{" "}
                          was merged into main
                        </>
                      ) : (
                        <span className="text-gray-700">
                          {lastMergeInfo.message}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {lastMergeInfo.timeAgo} ·{" "}
                      {lastMergeInfo.hash?.slice(0, 8)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Total Branches</p>
                <p className="text-2xl font-bold text-gray-900">
                  {branches.length}
                </p>
              </div>
            </div>

            {sortedBranches.length === 0 ? (
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
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedBranches.map((branch, index) => {
                        const isMain = branch.name === "main";
                        const isLoading = actionLoading[branch.name];

                        return (
                          <tr
                            key={`${branch.name}-${index}`}
                            className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                              isMain ? "bg-blue-50/30" : "hover:bg-gray-50"
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
                                {isMain && (
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                    Default
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {isMain ? (
                                  <button
                                    onClick={handleUnmerge}
                                    disabled={unmergeLoading}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                  >
                                    {unmergeLoading ? (
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
                                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                        />
                                      </svg>
                                    )}
                                    Unmerge Last
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleMergeToMain(branch.name)
                                    }
                                    disabled={isLoading}
                                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-mainColor text-white hover:opacity-90 disabled:opacity-50"
                                  >
                                    {isLoading ? (
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
                                    Merge to Main
                                  </button>
                                )}
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
                  {sortedBranches.map((branch, index) => {
                    const isMain = branch.name === "main";
                    const isLoading = actionLoading[branch.name];

                    return (
                      <div
                        key={`mobile-${branch.name}-${index}`}
                        className={`bg-white rounded-xl border p-4 ${
                          isMain
                            ? "border-blue-200 bg-blue-50/20"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {branch.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {branch.protected && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">
                                  Protected
                                </span>
                              )}
                              {isMain && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isMain ? (
                          <button
                            onClick={handleUnmerge}
                            disabled={unmergeLoading}
                            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            {unmergeLoading ? (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : null}
                            Unmerge Last
                          </button>
                        ) : (
                          <button
                            onClick={() => handleMergeToMain(branch.name)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-mainColor text-white hover:opacity-90 disabled:opacity-50"
                          >
                            {isLoading ? (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : null}
                            Merge to Main
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default GitDashboardContent;
