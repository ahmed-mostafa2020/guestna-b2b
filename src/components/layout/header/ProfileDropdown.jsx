import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import LogoutButton from "../../features/profile/LogoutButton";
import ProfileImage from "../../features/profile/ProfileImage";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const dropdownRef = useRef();
  const logoutButtonRef = useRef();

  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when pathname changes (navigation between pages)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside (but not when logout modal is open)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !isLogoutModalOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLogoutModalOpen]);

  const dropdownList = [
    {
      name: t("profile.aside.information"),
      url: `/${locale}/profile`,
    },
  ];

  const renderedDropdownList = dropdownList.map((item, index) => (
    <Link
      key={index}
      href={item.url}
      className={`flex items-center justify-between px-4 py-4 text-sm transition-all duration-200 ease-in-out cursor-pointer  hover:bg-buttonsHover ${
        index === dropdownList.length - 1
          ? "border-b-0 "
          : "border-border border-b"
      }`}
    >
      <span>{item.name}</span>
    </Link>
  ));

  return (
    <div
      className="relative transition-all duration-200 ease-in-out shadow-profile rounded-xl"
      ref={dropdownRef}
    >
      <button
        className="flex items-center justify-between w-full gap-2 px-4 py-2 text-base font-medium"
        onClick={toggleDropdown}
      >
        <ProfileImage />

        <svg
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.5886 6.90814C15.914 7.23358 15.914 7.76121 15.5886 8.08665L10.5886 13.0867C10.2632 13.4121 9.73553 13.4121 9.41009 13.0867L4.41009 8.08665C4.08466 7.76121 4.08466 7.23358 4.41009 6.90814C4.73553 6.5827 5.26317 6.5827 5.5886 6.90814L9.99935 11.3189L14.4101 6.90814C14.7355 6.5827 15.2632 6.5827 15.5886 6.90814Z"
            fill="black"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute -bottom-[120px] z-10 w-max py-2 bg-[#FCFCFC]">
          {renderedDropdownList}
          <div ref={logoutButtonRef}>
            <LogoutButton 
              onLogoutComplete={() => setIsOpen(false)}
              onModalOpen={() => setIsLogoutModalOpen(true)}
              onModalClose={() => setIsLogoutModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
