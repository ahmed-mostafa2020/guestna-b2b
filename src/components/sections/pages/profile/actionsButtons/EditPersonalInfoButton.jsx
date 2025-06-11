"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import actGetCountriesAndNationalities from "@store/address/act/actGetCountriesAndNationalities";

import { useState } from "react";

import CustomizedModal from "@components/common/customizedModal";
import FrameWithImagedHeader from "@components/common/frameWithImagedHeader/FrameWithImagedHeader";
import PersonalDataEditing from "@components/forms/personalDataEditing";

const EditPersonalInfoButton = () => {
  const { list, loading } = useSelector((state) => state.address);

  const [open, setOpen] = useState(false);

  const locale = useLocale();
  const dispatch = useDispatch();

  const handleClick = () => {
    setOpen(true);
    if (list.length === 0 && loading !== "loading") {
      dispatch(actGetCountriesAndNationalities(locale));
    }
  };

  const handleClose = () => setOpen(false);

  const t = useTranslations();

  return (
    <>
      <button
        onClick={handleClick}
        className="text-black transition-all duration-150 ease-in-out border-b border-black font-ibm hover:text-mainColor hover:border-b hover:border-mainColor"
      >
        {t("links.edit")}
      </button>
      <CustomizedModal
        open={open}
        handleClose={handleClose}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        <div className="centered">
          <FrameWithImagedHeader>
            <PersonalDataEditing handleClose={handleClose} />
          </FrameWithImagedHeader>
        </div>
      </CustomizedModal>
    </>
  );
};

export default EditPersonalInfoButton;
