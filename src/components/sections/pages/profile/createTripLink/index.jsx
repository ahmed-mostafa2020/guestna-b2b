import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { memo, useState } from "react";
import axios from "axios";

import { TRIP_STATUS } from "@constants/tripStatus";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import getErrorMessage from "@utils/getErrorMessage";
import CustomizedModal from "@components/common/customizedModal";
import { useSnackbar } from "notistack";

import { smallWhatsappIcon, posterIcon, copyIcon } from "@assets/svg";
import templete from "@assets/templete.png";
import generateLink from "@assets/generateLink.png";
import { CircularProgress } from "@mui/material";

const CreateTripLink = ({ data }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [showLinkModal, setShowLinkModal] = useState(false);

  const tripData = data?.tripData;

  const [tripStatus, setTripStatus] = useState(tripData?.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const tripLink = `${window.location.origin}/${locale}/parents/${tripData?.slug}`;

  const handleWhatsAppShare = () => {
    const message = `${t("profile.createTripLink.booking.shareMessage")} ${
      tripData?.name
    }\n\n${tripLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = `${t("profile.createTripLink.booking.emailSubject")} ${
      tripData?.name
    }`;
    const body = `${t("profile.createTripLink.booking.emailBody")}\n\n${
      tripData?.name
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

  // const handleOpenLinkModal = async () => {
  //   if (tripData?.status !== TRIP_STATUS.SCHEDULED) {
  //     setShowLinkModal(true);
  //   }

  //   if (tripData?.status === TRIP_STATUS.SCHEDULED) {
  //     setIsUpdatingStatus(true);
  //     try {
  //       const headers = getHeaders(locale);
  //       const response = await axios.patch(
  //         getProxyUrl(
  //           `${B2B_END_POINTS.PROFILE.UPDATE_TRIP_STATUS}/${tripData._id}`
  //         ),
  //         {},
  //         { headers }
  //       );

  //       if (response.data) {
  //         enqueueSnackbar(t("forms.customTrip.success"), {
  //           variant: "success",
  //         });
  //         // Update trip status locally to enable buttons
  //         tripData.status = TRIP_STATUS.PENDING;
  //         setShowLinkModal(true);
  //       }
  //     } catch (error) {
  //       console.error("Error updating trip status:", error);
  //       console.log("Error details:", error);

  //       const errorMessage = getErrorMessage(error, t);
  //       enqueueSnackbar(errorMessage, {
  //         variant: "error",
  //       });
  //       setIsUpdatingStatus(false);
  //       return; // Don't open modal if status update failed
  //     } finally {
  //       setIsUpdatingStatus(false);
  //     }
  //   }
  // };

  const handleOpenLinkModal = async () => {
    // Check if the trip is already scheduled before proceeding
    const isScheduled = tripStatus === TRIP_STATUS.SCHEDULED;

    if (!isScheduled) {
      // If the trip is not scheduled, simply open the modal
      setShowLinkModal(true);
      return;
    }

    // If the trip is scheduled, we need to update its status
    setIsUpdatingStatus(true);
    const tripUrl = getProxyUrl(
      `${B2B_END_POINTS.PROFILE.UPDATE_TRIP_STATUS}/${tripData._id}`
    );

    try {
      const headers = getHeaders(locale);
      const response = await axios.patch(tripUrl, {}, { headers });

      if (response.data) {
        // Show success message
        enqueueSnackbar(t("profile.createTripLink.linkCreated"), {
          variant: "success",
        });

        setTripStatus(TRIP_STATUS.PENDING);

        setShowLinkModal(true);
      }
    } catch (error) {
      console.error("Failed to update trip status:", error);
      const errorMessage = getErrorMessage(error, t);
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      // This block always executes, regardless of success or failure
      setIsUpdatingStatus(false);
    }
  };

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <h2 className="text-lg lg:text-2xl font-medium text-titleColor">
        {tripData?.name}
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
            className={`cursor-pointer min-w-[192px] h-[240px] hover:shadow-lg transition-all duration-200 ease-in-out rounded-lg relative ${
              isUpdatingStatus ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={() => !isUpdatingStatus && handleOpenLinkModal()}
          >
            <Image
              src={generateLink}
              alt="generateLink"
              width={192}
              height={240}
              className="rounded-lg w-[192px] h-[240px]"
              priority={true}
            />
            {isUpdatingStatus && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                <CircularProgress size={40} sx={{ color: "primary" }} />
              </div>
            )}
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
                disabled={tripStatus === TRIP_STATUS.SCHEDULED}
                onClick={handleWhatsAppShare}
                className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed gap-1 px-4 text-sm rounded-[4px] transition-all duration-150 hover:text-mainColor ease-in-out border border-titleColor bg-[#E6F6F4] py-1 w-fit text-titleColor hover:shadow-md"
              >
                {smallWhatsappIcon}
                {t("profile.createTripLink.booking.links.whatsapp")}
              </button>

              <button
                disabled={tripStatus === TRIP_STATUS.SCHEDULED}
                onClick={handleEmailShare}
                className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed gap-1 px-4 text-sm rounded-[4px] transition-all duration-150 hover:text-mainColor ease-in-out border border-titleColor bg-[#E6F6F4] py-1 w-fit text-titleColor hover:shadow-md"
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
              {t("profile.createTripLink.modal.subtitle")} "{tripData?.name}"
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
