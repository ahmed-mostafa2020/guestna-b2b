import { useState } from "react";
import { useTranslations } from "next-intl";

import CustomizedModal from "@components/common/customizedModal";
import ConfirmRequestForm from "@components/forms/confirmRequest";

const ConfirmRequest = () => {
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="centered flex-col gap-3">
        <button 
          onClick={handleOpenModal}
          className="w-full py-3 px-4 text-white font-medium rounded-lg bg-titleColor hover:bg-mainColor transition-all duration-200 ease-in-out"
        >
          {t("links.confirmRequest")}
        </button>

        <p className="text-sm text-textLight">{t("tripDetails.revsionTime")}</p>
      </div>

      <CustomizedModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        bgcolor="rgba(0, 0, 0, 0.7)"
      >
        <ConfirmRequestForm onClose={handleCloseModal} />
      </CustomizedModal>
    </>
  );
};

export default ConfirmRequest;
