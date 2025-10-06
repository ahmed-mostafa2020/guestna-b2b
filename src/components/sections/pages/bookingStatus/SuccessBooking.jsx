import Image from "next/image";
import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearFinalTripDetailsData } from "@store/checkout/finalTripDetailsSlice";

import formatDate from "@utils/FormateDate";
import BookingDataCard from "./BookingDataCard";

import { Container } from "@mui/material";

import { shareIcon } from "@assets/svg";
import successBooking from "@assets/successBooking.png";

const SuccessBooking = ({ data }) => {
  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useDispatch();

  // Clear finalTripDetailsData on successful payment
  useEffect(() => {
    console.log("Payment successful - Clearing checkout data");
    dispatch(clearFinalTripDetailsData());
  }, [dispatch]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        console.log("Share successful");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert("Your browser does not support sharing.");
    }
  };

  return (
    <Container maxWidth="lg" className="flex-col gap-4 centered">
      <Image
        src={successBooking}
        alt="success booking"
        width={90}
        height={90}
        priority={true}
      />

      <h2 className="font-semibold text-center lg:text-5xl text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#49A7A6] to-[#327171]">
        {t("bookingStatus.success.title")}
      </h2>

      <h3 className="text-transparent text-center bg-clip-text bg-gradient-to-r from-[#49A7A6] to-[#327171] text-xl font-medium lg:text-3xl pb-2">
        {t("bookingStatus.success.subTitle")}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        <BookingDataCard
          title={t("bookingStatus.success.data.senderName")}
          subTitle={data.bookingInfo.childs[0].name}
        />
        <BookingDataCard
          title={t("bookingStatus.success.data.bookingId")}
          subTitle={data.bookingInfo.orderId}
        />
        <BookingDataCard
          title={t("bookingStatus.success.data.paymentTime")}
          subTitle={formatDate(data.bookingInfo.paymentTime, locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
        <BookingDataCard
          title={t("bookingStatus.success.data.paymentMethod")}
          subTitle={data.bookingInfo.paymentType}
        />

        <button
          onClick={handleShare}
          className="gap-1 px-4 py-3 mt-2 font-medium text-center transition-all duration-200 ease-in-out border-2 rounded-lg centered lg:px-9 border-secColor text-mainColor hover:border-mainColor"
        >
          {shareIcon}
          {t("links.shareReceipt")}
        </button>

        <Link
          href={`/${locale}`}
          className="py-3 mt-2 font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor hover:border-linksHover bg-mainColor hover:bg-linksHover"
        >
          {t("links.backHome")}
        </Link>
      </div>
    </Container>
  );
};

export default memo(SuccessBooking);
