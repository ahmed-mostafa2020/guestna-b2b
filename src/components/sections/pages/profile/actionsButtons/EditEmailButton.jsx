import { useTranslations } from "next-intl";

import { useState } from "react";

import CustomizedModal from "@components/common/customizedModal";
import FrameWithImagedHeader from "@components/common/frameWithImagedHeader/FrameWithImagedHeader";
import EmailEditing from "@components/forms/personalDataEditing/EmailEditing";

const EditEmailButton = () => {
  const [openEmailEditing, setOpenEmailEditing] = useState(false);
  const handleOpenEmailEditing = () => setOpenEmailEditing(true);
  const handleCloseEmailEditing = () => setOpenEmailEditing(false);

  const t = useTranslations();

  return (
    <>
      <button
        onClick={handleOpenEmailEditing}
        className="text-black transition-all duration-150 ease-in-out border-b border-black font-ibm hover:text-mainColor hover:border-b hover:border-mainColor"
      >
        {t("links.edit")}
      </button>

      <CustomizedModal
        open={openEmailEditing}
        handleClose={handleCloseEmailEditing}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        <div className="centered">
          <FrameWithImagedHeader>
            <EmailEditing handleClose={handleCloseEmailEditing} />
          </FrameWithImagedHeader>
        </div>
      </CustomizedModal>
    </>
  );
};

export default EditEmailButton;
