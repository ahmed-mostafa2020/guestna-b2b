"use client";

import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";

import { useEffect, useState } from "react";

import Video from "../../common/trips/Video";
import ImageWithPlaceholder from "../../common/imagesPlaceholder/ImageWithPlaceholder";

import paymentBg from "@assets/sectionBackground/paymentBg.png";
import plans from "@assets/sectionBackground/plans.png";

import visa from "@assets/paymentLogos/visa.png";
// import stcLogo from "@assets/paymentLogos/stc.png";
import madaLogo from "@assets/paymentLogos/mada.svg";
import masterCard from "@assets/paymentLogos/master-card.svg";
import applePayLogo from "@assets/paymentLogos/apple-pay.svg";
import amExpressLogo from "@assets/paymentLogos/amExpress.png";
import tamaraLogo from "@assets/paymentLogos/tamara.svg";

import poster from "@assets/img-payment.png";
import { doneIcon } from "@assets/svg";

import { Container } from "@mui/material";

const PaymentSection = () => {
  const [height, setHeight] = useState(300);

  const mostBeautifulPlacesData = useSelector(
    (state) => state.homeData.items.mostBeautifulPlaces
  );

  const locale = useLocale();
  const t = useTranslations();

  const benefits = [
    { name: t("payments.confidentialityOfInformation") },
    { name: t("payments.customerSupport") },
    { name: t("payments.safePayment") },
    { name: t("payments.transparentPolicies") },
  ];

  const renderedBenefits = benefits.map((benefit, index) => (
    <div key={index} className="flex gap-2 md:flex-1 w-full min-w-[50%]">
      {doneIcon}
      <p className="text-base font-medium lg:text-lg">{benefit.name}</p>
    </div>
  ));

  const paymentMethods = [
    { name: "visa", image: visa },
    // { name: "STC", image: stcLogo},
    { name: "mada", image: madaLogo },
    { name: "masterCard", image: masterCard },
    { name: "Apple pay", image: applePayLogo },
    { name: "American Express pay", image: amExpressLogo },
    { name: "Tamara pay", image: tamaraLogo },
  ];

  const renderedPaymentMethods = paymentMethods.map((paymentMethod, index) => (
    <Image
      key={index}
      src={paymentMethod.image}
      alt={paymentMethod.name}
      title={paymentMethod.name}
      width={110}
      height={28}
      className="object-contain h-7"
    />
  ));

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerWidth >= 1024 ? 510 : 250);
    };
    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative pt-5 bg-white lg:pt-20 pb-36">
      <div className="absolute bottom-0 flex items-end w-full h-full -translate-x-1/2 end-1/2">
        <Image
          src={paymentBg}
          alt="background"
          className="object-contain lg:object-cover"
        />
      </div>

      <Container
        maxWidth="lg"
        className="relative flex flex-wrap items-center justify-center gap-6 lg:justify-between"
      >
        <div className="flex flex-col gap-2 lg:gap-6 lg:flex-1">
          <Image
            src={plans}
            alt="payment"
            width={445}
            height={105}
            className="mb-[-10px] lg:mb-[-30px] ps-12"
          />

          <p className="font-semibold w-fit bg-[#F2F4F6] text-xs lg:text-sm py-2 px-9 lg:py-3 lg:px-6 text-badge rounded-[50px]">
            {t("payments.badge")}
          </p>

          <h2 className="text-mainColor lg:w-4/5 text-base lg:text-3xl font-semibold leading-8 lg:leading-[60px]">
            {t("payments.title")}
          </h2>

          <h3 className="text-sm lg:text-lg font-medium text-secColor lg:w-[65%]">
            {t("payments.subTitle")}
          </h3>

          <div className="flex flex-wrap py-4 lg:py-0 gap-y-4">
            {renderedBenefits}
          </div>

          <h3 className="text-base font-semibold lg:text-xl text-mainColor">
            {t("payments.safePayment")}
          </h3>

          <div className="flex items-center gap-2 py-2 lg:flex-wrap">
            {renderedPaymentMethods}
          </div>
        </div>

        <div className="relative w-[250px] lg:w-[420px] h-[250px] lg:h-[510px]">
          <Video
            height={height}
            src={mostBeautifulPlacesData?.[0]?.video}
            poster={poster}
            showTitleLink={false}
          />

          <figure className=" lg:flex absolute z-[5] lg:bottom-[-30px]  items-end justify-center w-full -translate-x-1/2 end-1/2 ">
            {/* <Image
              src={review}
              alt="reviews"
              width="auto"
              height="auto"
              className="w-[230px] h-[150px] lg:w-[310px] lg:h-[200px]"
            /> */}

            {mostBeautifulPlacesData?.[0]?.thumbnail?.app && (
              <ImageWithPlaceholder
                src={mostBeautifulPlacesData[0].thumbnail.app}
                alt="reviews"
                width={210}
                height={235}
                className={`absolute object-cover lg:bottom-[-75px] -bottom-[100px] rounded-[16px] lg:w-[210px] w-[150px] lg:h-[235px] h-[150px] box-shadow ${
                  locale === "ar" ? "end-6" : "end-[-300px]"
                } `}
              />
            )}
          </figure>
        </div>
      </Container>
    </section>
  );
};

export default PaymentSection;
