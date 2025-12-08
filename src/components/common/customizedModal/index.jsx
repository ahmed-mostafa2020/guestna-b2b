"use client";

import { memo } from "react";

import { Box, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomizedModal = ({
  children,
  open,
  handleClose,
  bgcolor = "rgba(0, 0, 0, 0.9)",
  customizedCloseButton = false,
  closeButton = true,
  padding = true,
  width = "100%",
}) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    height: "100%",
    bgcolor: bgcolor,
    boxShadow: 24,
    p: padding ? 4 : 0,
    outline: "none",
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={style} className="overflow-auto ">
        {handleClose && !customizedCloseButton && closeButton ? (
          <div className="flex items-center w-full mb-3">
            <button onClick={handleClose} className="outline-none centered">
              <CloseIcon sx={{ color: "white", fontSize: "24px", zIndex: 3 }} />
            </button>
          </div>
        ) : closeButton ? (
          <button
            onClick={handleClose}
            className="mt-4 bg-white rounded-full outline-none ms-4 w-7 h-7 centered"
          >
            <CloseIcon sx={{ color: "black", fontSize: "22px", zIndex: 3 }} />
          </button>
        ) : null}

        {children}
      </Box>
    </Modal>
  );
};

export default memo(CustomizedModal);
