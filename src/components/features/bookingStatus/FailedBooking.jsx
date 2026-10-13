import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";

import failedBooking from "@assets/failedBooking.svg";

import { Container } from "@mui/material";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearFinalTripDetailsData } from "@store/checkout/finalTripDetailsSlice";

const FailedBooking = () => {
  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useDispatch();

  // Keep the slug before clearing — a retry needs a new client (session key)
  // from the registration form; the backend rejects the failed one.
  const storedSlug = useSelector(
    (state) => state.finalTripDetailsData?.data?.slug
  );
  const [tripSlug] = useState(storedSlug);

  useEffect(() => {
    dispatch(clearFinalTripDetailsData());
  }, [dispatch]);

  const retryUrl = tripSlug ? `/${locale}/parents/${tripSlug}` : `/${locale}`;

  return (
    <Container maxWidth="lg" className="flex-col centered">
      <Image
        src={failedBooking}
        alt="failed booking"
        width={220}
        height={220}
      />

      <div className="flex-col gap-3 my-5 font-semibold text-center centered lg:my-10">
        <h2 className="text-xl lg:text-3xl  text-[#FF6550]">
          {t("bookingStatus.failure.title")}
        </h2>

        <h3 className="text-lg font-medium lg:text-xl text-[#FF6550]">
          {t("bookingStatus.failure.subTitle")}
        </h3>
      </div>

      <Link
        href={retryUrl}
        className="text-white bg-[#82181A] py-3 px-10 lg:px-20 rounded-lg mt-2 hover:bg-secColor transition-all duration-200 ease-in-out"
      >
        {t("validations.tryAgain")}
      </Link>
    </Container>
  );
};

export default FailedBooking;
