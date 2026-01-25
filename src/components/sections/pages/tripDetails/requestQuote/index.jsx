"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";

import FrameWithImagedHeader from "@components/common/frameWithImagedHeader/FrameWithImagedHeader";
import CustomizedModal from "@components/common/customizedModal";
import RequestQuoteForm from "@components/forms/requestQuote";
import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

const RequestQuote = () => {
  const [isRequestQuoteFormOpen, setIsRequestQuoteFormOpen] = useState(false);

  const handleRequestQuoteFormOpen = () => {
    setIsRequestQuoteFormOpen(true);
  };
  const handleRequestQuoteFormClose = () => {
    setIsRequestQuoteFormOpen(false);
  };

  const t = useTranslations();

  return (
    <>
      <FrameWithImagedHeader withBorder={true}>
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleRequestQuoteFormOpen}
            className="flex-1 py-3 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor hover:bg-linksHover hover:border-linksHover bg-mainColor"
            {...getGtmTag(GTM_TAGS.TRIP_DETAILS.REQUEST_QUOTE, "trip_details")}
          >
            {t("links.requestQuote")}
          </button>

          <Link
            target="_blank"
            href={CONSTANT_VALUES.WHATSAPP_CONTACT}
            className="flex-1 py-3 text-base font-semibold text-center transition-all duration-200 ease-in-out bg-white border-2 rounded-lg border-secColor text-mainColor hover:text-white hover:bg-secColor "
            {...getGtmTag(
              GTM_TAGS.TRIP_DETAILS.CONTACT_WHATSAPP,
              "trip_details"
            )}
          >
            {t("links.contactUs")}
          </Link>
        </div>
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
