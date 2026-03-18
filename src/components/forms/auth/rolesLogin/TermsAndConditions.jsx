import { useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import { setConfirmTermsAndConditions } from "@store/forms/auth/login/loginFormSlice";

import { memo } from "react";

import ActionsDialog from "@components/features/customization/gridSection/largeSizeGrid/dayActivities/eventCard/actionsDialog";

const TermsAndConditions = ({ handleClose }) => {
  const t = useTranslations();
  const dispatch = useDispatch();

  const handleConfirm = () => {
    dispatch(setConfirmTermsAndConditions());
    handleClose();
  };

  return (
    <ActionsDialog
      open={open}
      handleClose={handleClose}
      closeButton={true}
      bgcolor="rgba(0, 0, 0, 0.3)"
      width="max-w-[1000px]"
    >
      <div className="flex flex-col gap-3 px-4 mb-6 ">
        <h3 className="text-2xl font-semibold text-mainColor">
          {t("pagesHead.title.termsAndConditions")}
        </h3>

        <h4 className="text-[#132F41] text-lg font-medium">
          {t("forms.auth.login.termsAndConditions.title")}
        </h4>

        <p className="max-h-[400px] overflow-y-auto text-[#6B6B6B] leading-6">
          {t("forms.auth.login.termsAndConditions.text")}
        </p>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleConfirm}
          className="px-8 py-2 font-medium text-white transition-all duration-200 ease-in-out border-2 rounded-lg bg-mainColor border-mainColor hover:bg-linksHover hover:border-linksHover"
        >
          {t("links.confirm")}
        </button>

        <button
          onClick={handleClose}
          className="px-8 py-2 font-medium transition-all duration-200 ease-in-out bg-white hover:text-linksHover"
        >
          {t("links.cancel")}
        </button>
      </div>
    </ActionsDialog>
  );
};

export default memo(TermsAndConditions);
