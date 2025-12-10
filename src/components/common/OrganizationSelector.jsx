"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrganizations,
  setSelectedOrganizations,
  toggleOrganization,
} from "@store/profile/selectedOrganizationsSlice";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { useLocale } from "next-intl";
import Cookies from "js-cookie";
import { Skeleton, Checkbox, TextField, InputAdornment } from "@mui/material";
import { Search, KeyboardArrowDown, Close } from "@mui/icons-material";

const OrganizationSelector = () => {
  const t = useTranslations();
  const locale = useLocale();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get organizations from Redux
  const { selectedIds, organizations, allSelected } = useSelector(
    (state) => state.selectedOrganizations
  );

  // Fetch organizations from API (skip org header to avoid circular dependency)
  const { data, isLoading } = useFetchData(
    B2B_END_POINTS.PROFILE.HEADER_FILTER_BY_ORGANIZATION,
    {},
    {
      lang: locale,
      skipOrgHeader: true,
    }
  );

  // Update organizations in Redux when data changes
  useEffect(() => {
    if (data) {
      dispatch(setOrganizations(data));
    }
  }, [data, dispatch]);

  // Save selectedIds to cookie whenever they change
  useEffect(() => {
    if (selectedIds.length > 0) {
      Cookies.set(
        CONSTANT_VALUES.SELECTED_ORGANIZATIONS,
        JSON.stringify(selectedIds),
        { expires: 30 }
      );
    }
  }, [selectedIds]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter organizations based on search term
  const filteredOrganizations = useMemo(() => {
    if (!searchTerm.trim()) return organizations;
    const lowerSearch = searchTerm.toLowerCase();
    return organizations.filter((org) =>
      org.name?.toLowerCase().includes(lowerSearch)
    );
  }, [organizations, searchTerm]);

  // Check if all organizations are selected
  const isAllSelected = allSelected;

  // Check if a specific organization is selected
  const isOrgSelected = (orgId) => {
    return selectedIds.includes(orgId);
  };

  // Handle "All" checkbox toggle
  const handleAllToggle = () => {
    // Always select all organizations
    dispatch(setSelectedOrganizations(organizations.map((org) => org._id)));
  };

  // Handle individual organization toggle
  const handleOrgToggle = (orgId) => {
    dispatch(toggleOrganization(orgId));
  };

  // Get display text for the selector button
  const getDisplayText = () => {
    if (isAllSelected) {
      return t("profile.organizationSelector.allSchools");
    }
    if (selectedIds.length === 1) {
      const org = organizations.find((o) => o._id === selectedIds[0]);
      return org ? `${org.name}` : "";
    }
    return t("profile.organizationSelector.selectedCount", {
      count: selectedIds.length,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full min-w-[180px] max-w-[350px] px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-mainColor transition-colors focus:outline-none focus:border-mainColor"
      >
        <span
          className="text-sm font-medium text-textDark truncate"
          title={getDisplayText()}
        >
          {isLoading ? (
            <Skeleton variant="text" width={150} />
          ) : (
            getDisplayText()
          )}
        </span>
        <KeyboardArrowDown
          className={`text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full min-w-[200px] lg:min-w-[350px] mt-2 bg-white border border-mainColor rounded-xl overflow-hidden shadow-card end-0">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <TextField
              fullWidth
              size="small"
              placeholder={t("profile.organizationSelector.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-gray-400" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <button
                        onClick={() => setSearchTerm("")}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <Close className="text-gray-400 text-sm" />
                      </button>
                    </InputAdornment>
                  ),
                  classes: {
                    input: "!font-somar",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  "& fieldset": {
                    border: "2px solid !important",
                    borderColor: "var(--color-border) !important",
                    borderRadius: "0.75rem !important",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--color-main)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-main)",
                  },
                },
              }}
            />
          </div>

          {/* Organizations List */}
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="p-3 space-y-2">
                <Skeleton variant="rounded" height={40} />
                <Skeleton variant="rounded" height={40} />
                <Skeleton variant="rounded" height={40} />
              </div>
            ) : (
              <>
                {/* All Schools Option */}
                <div
                  onClick={handleAllToggle}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                >
                  <Checkbox
                    checked={isAllSelected}
                    sx={{
                      padding: 0,
                      color: "var(--color-border)",
                      "&.Mui-checked": {
                        color: "var(--color-main)",
                      },
                    }}
                  />
                  <span
                    className="text-sm font-medium text-textDark truncate"
                    title={t("profile.organizationSelector.allSchools")}
                  >
                    {t("profile.organizationSelector.allSchools")}
                  </span>
                </div>

                {/* Individual Organizations */}
                {filteredOrganizations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {t("profile.organizationSelector.noResults")}
                  </div>
                ) : (
                  filteredOrganizations.map((org) => (
                    <div
                      key={org._id}
                      onClick={() => handleOrgToggle(org._id)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <Checkbox
                        checked={isOrgSelected(org._id)}
                        sx={{
                          padding: 0,
                          color: "var(--color-border)",
                          "&.Mui-checked": {
                            color: "var(--color-main)",
                          },
                        }}
                      />
                      <span className="text-sm text-textDark">{org.name}</span>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSelector;
