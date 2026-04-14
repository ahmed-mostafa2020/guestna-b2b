"use client";

import { memo } from "react";

import CustomizedModal from "@components/ui/customizedModal";
import Dialog from "@components/ui/customizedModal/Dialog";

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
  closeDialogButton,
  width,
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
        closeDialogButton={closeDialogButton}
        width={width}
      >
        {children}
      </Dialog>
    </CustomizedModal>
  );
};

export default memo(ActionsDialog);
