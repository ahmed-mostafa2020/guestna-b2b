"use client";

import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";

import Button from "@mui/material/Button";

import CloseIcon from "@mui/icons-material/Close";

const FilterButton = ({ gif, title, subTitle, index, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside both the anchor element and the menu
      if (
        anchorEl &&
        menuRef.current &&
        !anchorEl.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        setAnchorEl(null);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl]);

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        ref={anchorEl}
        className={`group transition-all duration-200 ease-in-out !rounded-xl ${
          open ? "opened" : ""
        }`}
        sx={{
          padding: "24px 16px",
          width: "100%",
          "&.opened": {
            backgroundColor: "#F4F5F5",
          },
          "&:hover": {
            backgroundColor: "#EBFFFD",
          },
        }}
      >
        <div className="flex w-full gap-2">
          <Image src={gif} alt="gif" width={24} height={24} className="h-6" />

          <div className="flex flex-col flex-1 gap-2 font-medium transition-all duration-200 ease-in-out group-hover:font-semibold font-somar text-start">
            <div className="flex items-center justify-between">
              <h3 className="text-base text-mainColor">{title}</h3>

              {open && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="w-6 h-6 bg-white rounded-full cursor-pointer hover:bg-gray-100 centered"
                >
                  <CloseIcon fontSize="13" sx={{ color: "#1F2626" }} />
                </span>
              )}
            </div>

            <h3 className="flex items-center gap-1 text-sm text-textDark">
              {subTitle}
            </h3>
          </div>
        </div>
      </Button>

      {open && (
        <div
          ref={menuRef}
          className={`absolute p-5 mt-3 max-h-[505px] overflow-y-auto overflow-x-hidden bg-white flex flex-col items-center gap-y-4 w-max card-shadow rounded-xl transition-all duration-200 ease-linear ${
            index != 4 ? "start-0" : "end-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default memo(FilterButton);
