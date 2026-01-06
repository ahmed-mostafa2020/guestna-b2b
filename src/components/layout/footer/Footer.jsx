"use client";

import Link from "next/link";
import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";

import { getGtmTag } from "@utils/gtmUtils";

import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";

// import stcLogo from "@assets/paymentLogos/stc.png";
import madaLogo from "@assets/paymentLogos/mada.svg";
import visaLogo from "@assets/paymentLogos/visa.svg";
import masterCardLogo from "@assets/paymentLogos/master-card.svg";
import applePayLogo from "@assets/paymentLogos/apple-pay.svg";
import amExpressLogo from "@assets/paymentLogos/amExpress.png";
import tamaraLogo from "@assets/paymentLogos/tamaraEnglish.webp";

const Footer = () => {
  const locale = useLocale();
  const t = useTranslations();

  const footerLinks = {
    company: {
      name: t("footer.company"),
      links: [
        {
          name: t("footer.aboutUs"),
          url: "https://about.guestna.app",
        },
        // {
        //   name: t("footer.articles"),
        //   url: "/articles",
        // },
        // {
        //   name: t("footer.bePartner"),
        //   url: "/be-partner",
        // },
        // {
        //   name: t("footer.jobOffers"),
        //   url: "/job-offers",
        // },
      ],
    },
    support: {
      name: t("footer.support"),
      links: [
        {
          name: t("footer.callUs"),
          url: `/${locale}/contact-us`,
        },
        {
          name: t("footer.faq"),
          url: `/${locale}/faq`,
        },
        // {
        //   name: t("footer.map"),
        //   url: "/map",
        // },
      ],
    },
    legal: {
      name: t("footer.legal"),
      links: [
        {
          name: t("footer.terms"),
          url: `/${locale}/terms-and-conditions`,
        },
        {
          name: t("footer.privacy"),
          url: `/${locale}/privacy-policy`,
        },
        {
          name: t("footer.return"),
          url: "/return-policy",
        },
        // {
        //   name: t("footer.advertising"),
        //   url: "/advertising",
        // },
      ],
    },
    payment: {
      name: t("footer.paymentMethods"),
      methods: [
        // { name: "STC", image: stcLogo },
        { name: "mada", image: madaLogo },
        { name: "Visa", image: visaLogo },
        { name: "mastercard", image: masterCardLogo },
        { name: "Apple Pay", image: applePayLogo },
        { name: "American Express Pay", image: amExpressLogo },
        { name: "Tamara pay", image: tamaraLogo },
      ],
    },
  };

  const renderedCompanyLinks = footerLinks.company.links.map(
    (companyLink, index) => (
      <Link
        href={companyLink.url}
        key={index}
        target="_blank"
        className="font-normal leading-7 capitalize transition-all duration-200 ease-in-out border-b border-transparent w-fit text-footerLink hover:border-footerLink"
        {...getGtmTag(
          `footer_company_${companyLink.name
            .toLowerCase()
            .replace(/\s+/g, "_")}`,
          "footer"
        )}
      >
        {companyLink.name}
      </Link>
    )
  );

  const renderedSupportLinks = footerLinks.support.links.map(
    (supportLink, index) => (
      <Link
        href={supportLink.url}
        key={index}
        className="font-normal leading-7 capitalize transition-all duration-200 ease-in-out border-b border-transparent w-fit text-footerLink hover:border-footerLink"
        {...getGtmTag(
          `footer_support_${supportLink.name
            .toLowerCase()
            .replace(/\s+/g, "_")}`,
          "footer"
        )}
      >
        {supportLink.name}
      </Link>
    )
  );

  const renderedLegalLinks = footerLinks.legal.links.map((legalLink, index) => (
    <Link
      href={legalLink.url}
      key={index}
      className="font-normal leading-7 capitalize transition-all duration-200 ease-in-out border-b border-transparent w-fit text-footerLink hover:border-footerLink"
      {...getGtmTag(
        `footer_legal_${legalLink.name.toLowerCase().replace(/\s+/g, "_")}`,
        "footer"
      )}
    >
      {legalLink.name}
    </Link>
  ));

  const renderedPaymentLinks = footerLinks.payment.methods.map(
    (paymentMethod, index) => (
      <Image
        key={index}
        src={paymentMethod.image}
        alt="payment method"
        width={40}
        height={26}
        priority="true"
        className="object-contain h-[26px] w-auto rounded-md"
        title={paymentMethod.name}
      />
    )
  );

  return (
    <footer className="py-10 lg:py-20 font-mulish">
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, sm: 5, md: 6 }}>
          <Grid
            size={{ xs: 4, sm: 3, lg: 3 }}
            className="flex flex-col gap-1 lg:gap-2"
          >
            <h4 className="lg:pb-2 text-[#000000cc] font-bold">
              {footerLinks.company.name}
            </h4>
            {renderedCompanyLinks}
          </Grid>

          <Grid
            size={{ xs: 4, sm: 3, lg: 3 }}
            className="flex flex-col gap-1 lg:gap-2"
          >
            <h4 className="pb-2 text-[#000000cc] font-bold">
              {footerLinks.support.name}
            </h4>
            {renderedSupportLinks}
          </Grid>

          <Grid
            size={{ xs: 4, sm: 3, lg: 3 }}
            className="flex flex-col gap-1 lg:gap-2"
          >
            <h4 className="pb-2 text-[#000000cc] font-bold">
              {footerLinks.legal.name}
            </h4>
            {renderedLegalLinks}
          </Grid>

          <Grid
            size={{ xs: 6, sm: 3, lg: 3 }}
            className="flex flex-col gap-1 lg:gap-2"
          >
            <h4 className="pb-2 text-[#000000cc] font-bold">
              {footerLinks.payment.name}
            </h4>
            <div className="flex flex-wrap gap-2">{renderedPaymentLinks}</div>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
