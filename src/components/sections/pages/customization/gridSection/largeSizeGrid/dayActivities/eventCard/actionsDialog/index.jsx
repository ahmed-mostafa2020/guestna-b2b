"use client";

import { memo } from "react";

import CustomizedModal from "@components/common/customizedModal";
import Dialog from "@components/common/customizedModal/Dialog";

const ActionsDialog = ({
  open,
  handleClose,
  header,
  title,
  content,
  children,
  cancelButton,
  confirmButton,
  handleConfirm,
}) => {
  return (
    <CustomizedModal
      open={open}
      handleClose={handleClose}
      closeButton={false}
      bgcolor="rgba(0, 0, 0, 0.3)"
    >
      <Dialog
        header={header}
        title={title}
        content={content}
        cancelButton={cancelButton}
        confirmButton={confirmButton}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
      >
        {children}
      </Dialog>
    </CustomizedModal>
  );
};

export default memo(ActionsDialog);
