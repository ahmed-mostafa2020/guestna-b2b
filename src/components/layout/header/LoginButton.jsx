"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Box } from "@mui/material";
import Menu from "@mui/material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const LoginButton = () => {
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
      <button
        onClick={handleClick}
        className="px-4 py-2 font-bold text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor hover:bg-linksHover hover:border-linksHover"
      >
        {t("header.login")}
      </button>

      <Menu
        id="roles-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
            className="absolute cursor-pointer start-5 top-5 "
          >
            <CloseIcon fontSize="16" />
          </span>

          <div className="flex flex-col gap-3 mt-10"></div>
        </Box>
      </Menu>
    </>
  );
};

export default LoginButton;
