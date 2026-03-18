import { memo } from "react";

const ProfilePagesFilters = ({ buttonsList }) => {
  const renderedButtonsList = buttonsList.map((button, index) => (
    <button
      key={index}
      onClick={button.handleClick}
      className="px-4 py-2 font-normal text-center text-black transition-all duration-150 ease-in-out bg-white border rounded-lg font-ibm border-accordionBorder hover:text-mainColor"
    >
      {button.name}
    </button>
  ));

  return buttonsList && <div className="flex gap-2">{renderedButtonsList}</div>;
};

export default memo(ProfilePagesFilters);
