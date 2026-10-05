"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

import { useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";

import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import CustomizedModal from "@components/ui/customizedModal";
import RequestQuoteForm from "@components/forms/requestQuote";

const RequestQuote = () => {
  const [isRequestQuoteFormOpen, setIsRequestQuoteFormOpen] = useState(false);
  const searchParams = useSearchParams();
  const onlyDetails = Boolean(searchParams.get("onlyDetails"));
  const handleRequestQuoteFormOpen = () => {
    setIsRequestQuoteFormOpen(true);
  };
  const handleRequestQuoteFormClose = () => {
    setIsRequestQuoteFormOpen(false);
  };

  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();

  const tripDetailsData = useSelector((state) => state.tripDetailsData?.data);
  const trip = tripDetailsData?.trip;
  const isMarketTemplate = Boolean(
    trip?.marketTemplate ?? tripDetailsData?.marketTemplate
  );
  const tripSlug =
    params?.tripSlug ||
    useSelector((state) => state.checkoutData?.tripSlug) ||
    trip?.slug;

  return (
    <>
      <FrameWithImagedHeader withBorder={true}>
        <div className="flex items-center justify-between gap-2">
          {!onlyDetails && (
            <button
              onClick={handleRequestQuoteFormOpen}
              className="flex-1 py-3 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor hover:bg-linksHover hover:border-linksHover bg-mainColor"
            >
              {t("links.requestQuote")}
            </button>
          )}

          <Link
            target="_blank"
            href={CONSTANT_VALUES.WHATSAPP_CONTACT}
            className="flex-1 py-3 text-base font-semibold text-center transition-all duration-200 ease-in-out bg-white border-2 rounded-lg border-secColor text-mainColor hover:text-white hover:bg-secColor "
          >
            {t("links.contactUs")}
          </Link>
        </div>

        {isMarketTemplate && (
          <div className="flex flex-col gap-3 pt-3 border-t border-border">
            <Link
              id="market-template-school-register-cta"
              href={`/${locale}/discover/${tripSlug}/school-booking`}
              className="w-full py-3 px-8 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-secColor bg-secColor hover:bg-buttonsHover hover:border-buttonsHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secColor focus-visible:ring-offset-2"
            >
              {t("tripDetails.marketTemplate.cta")}
            </Link>
            <p className="text-xs font-medium text-center font-ibm text-textDark/85 leading-relaxed px-1">
              {t("tripDetails.marketTemplate.ctaDescription")}
            </p>
          </div>
        )}
      </FrameWithImagedHeader>

      {/* Parent login form */}
      {isRequestQuoteFormOpen && (
        <div className="bg-white centered">
          <CustomizedModal
            open={isRequestQuoteFormOpen}
            handleClose={handleRequestQuoteFormClose}
            bgcolor="rgba(0, 0, 0, 0.5)"
            customizedCloseButton={true}
            padding={false}
          >
            <RequestQuoteForm />
          </CustomizedModal>
        </div>
      )}
    </>
  );
};

export default RequestQuote;
