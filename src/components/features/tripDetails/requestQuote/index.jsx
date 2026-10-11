"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

import { useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";

import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import CustomizedModal from "@components/ui/customizedModal";
import RequestQuoteForm from "@components/forms/requestQuote";
import MarketTemplateRegisterCta from "./MarketTemplateRegisterCta";

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
  const params = useParams();

  const tripDetailsData = useSelector((state) => state.tripDetailsData?.data);
  const checkoutTripSlug = useSelector((state) => state.checkoutData?.tripSlug);
  const trip = tripDetailsData?.trip;
  const isMarketTemplate = Boolean(
    trip?.marketTemplate ?? tripDetailsData?.marketTemplate
  );
  const tripSlug = params?.tripSlug || checkoutTripSlug || trip?.slug;
  const tripId = trip?._id || tripSlug;

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

        {isMarketTemplate && <MarketTemplateRegisterCta tripId={tripId} />}
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
