"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import LanguagesDropdown from "./LanguagesDropdown";
import CountriesDropdown from "./CountriesDropdown";

import * as React from "react";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { globalDarkIcon, globalLightIcon, newSarLarge } from "@assets/svg";

const SettingsButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const t = useTranslations();

  return (
    <>
      <Button
        id="settings-button"
        aria-controls={open ? "settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="text-black transition-all duration-200 ease-in-out rounded-lg centered hover:bg-buttonsHover"
        sx={{
          padding: "9px 4px",
          backgroundColor: open ? "#008F8F" : "transparent",
          borderRadius: "8px",
        }}
      >
        {open ? (
          <span> {globalLightIcon}</span>
        ) : (
          <span> {globalDarkIcon}</span>
        )}
        <span
          className={`ms-1 text-lg ps-1 border-s transition-all duration-200 ease-in-out ${
            open ? "border-white text-white" : "border-black text-black"
          }`}
        >
          {newSarLarge}
        </span>
      </Button>

      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "settings-button",
        }}
        sx={{ marginTop: "10px" }}
      >
        <Box
          className="outline-none"
          sx={{
            width: "400px",
            padding: "24px 16px",
            position: "relative",
            transition: "all 0.2s ease-in-out",
          }}
        >
          <span
            onClick={handleClose}
            className="absolute cursor-pointer start-5 top-5"
          >
            <CloseIcon fontSize="16" />
          </span>

          <h3 className="pb-6 text-sm font-medium text-center">
            {t("header.showSettings")}
          </h3>

          <div className="flex flex-col gap-3">
            <LanguagesDropdown />

            <CountriesDropdown />
          </div>
        </Box>
      </Menu>
    </>
  );
};

export default SettingsButton;
