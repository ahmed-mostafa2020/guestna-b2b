import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

import { memo, useState } from "react";

import { smallWhatsappIcon, posterIcon, copyIcon } from "@assets/svg";
import CustomizedModal from "@components/common/customizedModal";
import { useSnackbar } from "notistack";

import templete from "@assets/templete.png";
import generateLink from "@assets/generateLink.png";

const CreateTripLink = ({ data }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const tripLink = `${window.location.origin}/${locale}/parents/${data?.tripData?.slug}`;

  const handleWhatsAppShare = () => {
    const message = `${t("profile.createTripLink.booking.shareMessage")} ${
      data?.tripData?.name
    }\n\n${tripLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = `${t("profile.createTripLink.booking.emailSubject")} ${
      data?.tripData?.name
    }`;
    const body = `${t("profile.createTripLink.booking.emailBody")}\n\n${
      data?.tripData?.name
    }\n\n${t("profile.createTripLink.booking.linkLabel")}: ${tripLink}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tripLink);
      enqueueSnackbar(t("profile.createTripLink.modal.copySuccess"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      enqueueSnackbar("Failed to copy link", {
        variant: "error",
      });
    }
  };

  const handleOpenLinkModal = () => {
    setShowLinkModal(true);
  };

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <h2 className="text-lg lg:text-2xl font-medium text-titleColor">
        {data?.tripData?.name}
      </h2>

      <div className="flex flex-wrap gap-8">
        {/* Poster */}
        <div className="lg:flex-1 flex gap-4 flex-wrap lg:flex-nowrap items-center">
          <Image
            src={templete}
            alt="templete"
            width={192}
            height={240}
            className="rounded-lg w-[192px] h-[240px]"
            priority={true}
          />

          <div className="flex flex-col gap-4">
            <h3 className="text-lg lg:text-2xl font-medium text-titleColor">
              {t("profile.createTripLink.poster.title")}
            </h3>

            <p className="text-sm lg:text-base">
              {t("profile.createTripLink.poster.subTitle")}
            </p>

            <button
              disabled
              className="px-4 py-1 w-fit disabled:opacity-50 disabled:cursor-not-allowed rounded-lg bg-gray-200"
            >
              {t("profile.createTripLink.poster.links.generateLink")}
            </button>
          </div>
        </div>

        {/* Booking */}
        <div className="lg:flex-1 flex gap-4 flex-wrap lg:flex-nowrap items-center">
          <figure
            className="cursor-pointer min-w-[192px] h-[240px]"
            onClick={handleOpenLinkModal}
          >
            <Image
              src={generateLink}
              alt="generateLink"
              width={192}
              height={240}
              className="rounded-lg w-[192px] h-[240px]"
              priority={true}
            />
          </figure>

          <div className="flex flex-col gap-4">
            <h3 className="text-lg lg:text-2xl font-medium text-titleColor">
              {t("profile.createTripLink.booking.title")}
            </h3>

            <p className="text-sm lg:text-base">
              {t("profile.createTripLink.booking.subTitle")}
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1 px-4 text-sm rounded-[4px] transition-all duration-150 hover:text-mainColor ease-in-out border border-titleColor bg-[#E6F6F4] py-1 w-fit text-titleColor hover:shadow-md"
              >
                {smallWhatsappIcon}
                {t("profile.createTripLink.booking.links.whatsapp")}
              </button>

              <button
                onClick={handleEmailShare}
                className="flex items-center gap-1 px-4 text-sm rounded-[4px] transition-all duration-150 hover:text-mainColor ease-in-out border border-titleColor bg-[#E6F6F4] py-1 w-fit text-titleColor hover:shadow-md"
              >
                <span>@</span>
                {t("profile.createTripLink.booking.links.email")}
              </button>

              <button
                disabled
                className="flex items-center gap-1 px-4 text-sm rounded-[4px] opacity-50 cursor-not-allowed transition-all duration-150 hover:text-mainColor ease-in-out border border-titleColor bg-[#E6F6F4] py-1 w-fit text-titleColor hover:shadow-md"
              >
                {posterIcon}
                {t("profile.createTripLink.booking.links.poster")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Link Generation Modal */}
      {showLinkModal && (
        <CustomizedModal
          open={showLinkModal}
          handleClose={handleCloseLinkModal}
          bgcolor="rgba(0, 0, 0, 0.5)"
          customizedCloseButton={true}
          padding={false}
        >
          <div className="bg-white mx-auto flex flex-col gap-4 w-[90%] max-w-md rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-titleColor">
              {t("profile.createTripLink.modal.title")}
            </h2>

            <p className=" ">
              {t("profile.createTripLink.modal.subtitle")} "
              {data?.tripData?.name}"
            </p>

            <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <button
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                  title={t("profile.createTripLink.modal.copyButton")}
                >
                  {copyIcon}
                </button>
                <span className="flex-1 text-left break-all">{tripLink}</span>
                <span className="text-mainColor">🔗</span>
              </div>
            </div>

            <button
              onClick={handleCloseLinkModal}
              className="w-full bg-mainColor hover:bg-titleColor text-white py-2 px-4 rounded-lg transition-colors"
            >
              {t("profile.createTripLink.modal.closeButton")}
            </button>
          </div>
        </CustomizedModal>
      )}
    </div>
  );
};

export default memo(CreateTripLink);
