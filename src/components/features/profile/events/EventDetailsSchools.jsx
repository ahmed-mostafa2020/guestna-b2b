"use client";

import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import BusinessIcon from "@mui/icons-material/Business";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const EventDetailsSchools = ({ organizations }) => {
  const t = useTranslations("profile.events.details");
  const tSelector = useTranslations("profile.organizationSelector");
  const [searchQuery, setSearchQuery] = useState("");

  if (!organizations || organizations.length <= 1) {
    return null;
  }

  // Filter organizations by search query
  const filteredOrgs = organizations.filter((org) =>
    org.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {/* Title & Count */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-3 flex-wrap gap-2">
        <h3 className="text-lg font-bold text-gray-950 font-somar border-s-4 border-mainColor ps-3">
          {t("invitedSchools")}
        </h3>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-mainColor/10 text-mainColor font-ibm">
          {organizations.length}
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-gray-400">
          <SearchIcon fontSize="small" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchSchool")}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all text-start font-somar"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HighlightOffIcon fontSize="small" />
          </button>
        )}
      </div>

      {/* Schools List */}
      <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
        {filteredOrgs.length > 0 ? (
          filteredOrgs.map((org, index) => (
            <div
              key={org._id || index}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50/80 border border-transparent hover:border-gray-100 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-mainColor/10 group-hover:text-mainColor transition-all duration-200 flex-shrink-0">
                <BusinessIcon className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-semibold text-gray-700 font-somar text-start truncate group-hover:text-gray-900 transition-colors">
                {org.name}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-sm text-gray-400 font-somar">
            {tSelector("noResults")}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(EventDetailsSchools);
