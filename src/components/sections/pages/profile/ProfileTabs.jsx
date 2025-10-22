"use client";

import NavigationDropdownWithPermissions from "./NavigationDropdownWithPermissions";

const ProfileTabs = () => {
  return (
    <aside className="flex flex-col p-6 h-full space-y-4 bg-white border-e border-[#CAC9C9]">
      <NavigationDropdownWithPermissions />
    </aside>
  );
};

export default ProfileTabs;
