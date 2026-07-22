"use client";

import ProviderNavigationDropdown from "./ProviderNavigationDropdown";

const ProviderProfileTabs = () => {
  return (
    <aside className="flex flex-col p-6 h-full space-y-4 bg-white border-e border-[#CAC9C9]">
      <ProviderNavigationDropdown />
    </aside>
  );
};

export default ProviderProfileTabs;
