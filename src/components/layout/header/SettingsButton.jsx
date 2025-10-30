"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import LanguagesDropdown from "./LanguagesDropdown";
import CountriesDropdown from "./CountriesDropdown";
import ThemeDropdown from "./ThemeDropdown";

import { Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
          backgroundColor: open ? "var(--color-title)" : "transparent",
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

      {isMobile ? (
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          maxWidth="xs"
          scroll="paper"
          keepMounted
          PaperProps={{
            sx: {
              width: "calc(100vw - 24px)",
              maxWidth: "100vw",
              maxHeight: "90vh",
              overflowY: "auto",
              mx: 1.5,
              borderRadius: 2,
            },
          }}
        >
          <Box
            className="outline-none"
            sx={{
              width: "100%",
              padding: "16px",
              maxHeight: "90vh",
              overflowY: "auto",
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
        </Dialog>
      ) : (
        <Menu
          id="settings-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "settings-button",
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          PaperProps={{
            sx: {
              width: { xs: "calc(100vw - 24px)", sm: "auto" },
              maxWidth: "100vw",
              maxHeight: { xs: "90vh", sm: "unset" },
              overflowY: { xs: "auto", sm: "visible" },
              mx: { xs: 1.5, sm: 0 },
              borderRadius: { xs: 2, sm: 2 },
            },
          }}
          sx={{ marginTop: "10px" }}
        >
          <Box
            className="outline-none"
            sx={{
              width: { xs: "100%", sm: "400px" },
              padding: { xs: "16px", sm: "24px 16px" },
              maxHeight: { xs: "90vh", sm: "unset" },
              overflowY: { xs: "auto", sm: "visible" },
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
      )}
    </>
  );
};

export default SettingsButton;
