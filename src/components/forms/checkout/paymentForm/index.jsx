"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { resetPromoCode } from "@store/forms/promoCode/promoCodeSlice";

import { useEffect, useState } from "react";

import { END_POINTS } from "@constants/APIs";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import {
  createCreditSchema,
  createStcSchema,
  createStcOtpSchema,
  createTamaraSchema,
} from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import { cn } from "@utils/cn";

import TextInputGroup from "../../TextInputGroup";
import SelectionGroup from "../../SelectionGroup";
import PaymentMethod from "./PaymentMethod";
import OtpCounter from "./OtpCounter";
// import PromoCodeForm from "../promoCodeForm";
import TamaraWidget from "./TamaraWidget"; //tamara payment
import AppleWidget from "./AppleWidget";

import axios from "axios";
import { Field, Formik } from "formik";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { useSnackbar } from "notistack";

import { CircularProgress, RadioGroup } from "@mui/material";

import madaLogo from "@assets/paymentLogos/mada.svg";
import visaLogo from "@assets/paymentLogos/visa.svg";
import mastercardLogo from "@assets/paymentLogos/master-card.svg";
import amExpressLogo from "@assets/paymentLogos/amExpress.png";

import tamaraArabic from "@assets/paymentLogos/tamaraArabic.jpg";

import applePay from "@assets/paymentLogos/apple-pay.svg";

import tamaraEnglish from "@assets/paymentLogos/tamaraEnglish.svg";
import getProxyUrl from "@utils/getProxyUrl";
import AppleWidgetTest from "./AppleWidgetTest";

const PaymentForm = () => {
  const [formErrors, setFormErrors] = useState([]);
  const [_, setStatus] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);

  // For Form
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
  );
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // For STC
  const [showStcOtp, setShowStcOtp] = useState(false);
  const [stcBookingId, setStcBookingId] = useState();
  const [stcOtpTransactionUrl, setStcOtpTransactionUrl] = useState();
  const [showCounter, setShowCounter] = useState(true);

  //  For Apple pay
  const [canMakePayments, setCanMakePayments] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ApplePaySession) {
      ApplePaySession.canMakePayments();
      setCanMakePayments(true);
    }
  }, []);

  const router = useRouter();

  const currentYear = new Date().getFullYear();

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  const creditSchema = createCreditSchema(t);
  const stcSchema = createStcSchema(t);
  const stcOtpSchema = createStcOtpSchema(t);

  const tamaraSchema = createTamaraSchema(t);

  const requestSchema =
    currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
      ? creditSchema
      : currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.STC
      ? stcSchema
      : tamaraSchema;

  const handlePaymentMethodChange = (event) => {
    setCurrentPaymentMethod(event.target.value);
  };

  const tripId = useSelector((state) => state.checkoutData.tripId);

  // const promoCodeData = useSelector((state) => state.promoCode.promoCodeData);

  // const isCustomizable = useSelector(
  //   (state) => state.checkoutData.isCustomizable
  // );

  const {
    client,
    quantity,
    basePriceTotalWithVat,
    promoCode,
    discountedTotalPriceWithVat,
  } = useSelector((state) => state.finalTripDetailsData.data);

  const finalPrice = promoCode
    ? discountedTotalPriceWithVat
    : basePriceTotalWithVat;

  const { enqueueSnackbar } = useSnackbar();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;

  const baseData = {
    trip: tripId,
    quantity: quantity,
    client: client,
    ...(promoCode && { promoCode: promoCode }),
    // isCustom: isCustomizable || false,
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const data = {
      ...baseData,
      paymentMethod: currentPaymentMethod,
      redirectUrl: `${vercelUrl}/${locale}/bookingStatus`,
    };
    // Conditionally add payment information based on the payment method
    if (currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD) {
      data.paymentCridetInfo = {
        creditCardName: values.cardholderName,
        creditCardNumber: String(values.cardNumber),
        cvc: String(values.cvc),
        expiryMonth: values.expiryMonth,
        expiryYear: values.expiryYear,
      };
    } else if (currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.STC) {
      data.paymentSTCInfo = {
        phoneNumber: values.stcPhoneNumber,
      };
    } else if (
      currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.TAMARA
    ) {
      data.tamaraUserInfo = {
        phone: values.tamaraMobile,
        country: values.selectedCountry,
      };
    }

    let paymentJsonData = JSON.stringify(data);

    let stcOtpData = JSON.stringify({
      otp: String(values.stcOtp),
      transactionUrl: stcOtpTransactionUrl,
      redirectUrl: `${vercelUrl}${locale}/bookingStatus`,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        isFormSubmitted && showStcOtp
          ? getProxyUrl(
              `${END_POINTS.PAYMENTS}${END_POINTS.CONFIRM_STC_PAYMENT}/${stcBookingId}`
            )
          : getProxyUrl(B2B_END_POINTS.PAYMENT),

      headers,
      data: isFormSubmitted && showStcOtp ? stcOtpData : paymentJsonData,
    };
    axios
      .request(config)
      .then((response) => {
        setIsFormSubmitted(true);
        setSubmitting(false);
        setStatus(true);
        setFormErrors([]);
        resetForm();

        const { paymentMethod, transactionUrl, callback_url, bookingId } =
          response.data;

        // if (!transactionUrl || !callback_url) {
        //   throw new Error("No transaction URL received");
        // }

        if (
          paymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD ||
          paymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.TAMARA
        ) {
          enqueueSnackbar(t("forms.validation.payment.success"), {
            variant: "success",
          });
          setDisabledButton(true);
          router.push(transactionUrl);
        } else if (!callback_url) {
          setShowStcOtp(true);
          setStcOtpTransactionUrl(transactionUrl);
          setStcBookingId(bookingId);
          enqueueSnackbar(t("forms.validation.payment.sendOtp"), {
            variant: "success",
          });
        } else {
          enqueueSnackbar(t("forms.validation.payment.success"), {
            variant: "success",
          });
          setDisabledButton(true);
          setShowCounter(false);
          router.push(callback_url);
        }

        dispatch(resetPromoCode());
      })

      .catch((error) => {
        // Reset form states
        setDisabledButton(false);
        setSubmitting(false);
        setStatus(false);

        // Log the full error for debugging
        console.log("Error details:", error + formErrors);

        // Extract error message
        const errorMessage = error.response?.data?.message;
        const defaultErrorMessage = t(
          "forms.validation.api_errors.other_error"
        );
        // Handle payment invalid case
        if (errorMessage === "Payment is invalid.") {
          setShowStcOtp(false);
        }

        // Show error notification
        enqueueSnackbar(errorMessage || defaultErrorMessage, {
          variant: "error",
        });

        // Set form errors
        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  const creditImages = [
    { image: madaLogo, name: "mada" },
    { image: visaLogo, name: "Visa" },
    { image: mastercardLogo, name: "mastercard" },
    { image: amExpressLogo, name: "American Express" },
  ];

  // const stcImage = [{ image: stc, name: "stc" }];
  const tamaraImage = [
    { image: locale === "ar" ? tamaraArabic : tamaraEnglish, name: "tamara" },
  ];

  const appleImage = [{ image: applePay, name: "apple pay" }];

  // Expiry date
  // Generate array of months (01-12)
  const months = Array.from({ length: 12 }, (key, i) => {
    const monthNumber = i + 1;
    return monthNumber.toString().padStart(2, "0");
  });

  const years = Array.from({ length: 7 }, (key, i) => {
    return currentYear + i;
  });

  return (
    <>
      <h3 className="font-semibold">
        {t("forms.paymentMethodsForm.subTitle")}
      </h3>

      <Formik
        initialValues={{
          cardholderName: "",
          cardNumber: "",
          cvc: "",
          otp: "",
          expiryMonth: "",
          expiryYear: "",
          stcPhoneNumber: "",
          stcOtp: "",
          tamaraMobile: "",
          selectedCountry: "SA",
        }}
        validationSchema={
          isFormSubmitted && showStcOtp ? stcOtpSchema : requestSchema
        }
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnBlur={true}
        validateOnChange={true}
        validateOnMount={true}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={currentPaymentMethod}
              onChange={handlePaymentMethodChange}
              name="radio-buttons-group"
              className="flex flex-col w-full gap-7"
            >
              {/* Credit card and AmEx */}
              <div className="flex flex-col transition-all duration-200 ease-in-out">
                <PaymentMethod
                  value={CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD}
                  currentPaymentMethod={currentPaymentMethod}
                  label={t("forms.methods.credit")}
                  imagesList={creditImages}
                />

                {currentPaymentMethod ===
                  CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD && (
                  <div className="px-4 py-8 bg-[#FAF9F9] transition-all duration-200 ease-in-out">
                    <div className="flex flex-col gap-8 lg:w-[510px]">
                      <TextInputGroup
                        label={t("forms.cardholderName.name")}
                        type="text"
                        name="cardholderName"
                        value={values.cardholderName}
                        errors={errors.cardholderName}
                        touched={touched.cardholderName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <TextInputGroup
                        label={t("forms.cardNumber.name")}
                        type="text"
                        name="cardNumber"
                        inputMode="numeric"
                        value={values.cardNumber}
                        errors={errors.cardNumber}
                        touched={touched.cardNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        minLength="15"
                        maxLength="16"
                      />

                      <div className="flex flex-wrap gap-x-12 gap-y-4 lg:flex-nowrap">
                        <div className="flex flex-col justify-between gap-2">
                          <label className="font-medium font-ibm">
                            {t("forms.expirationDate.title")}
                          </label>

                          <div className="flex gap-3">
                            <SelectionGroup
                              name="expiryMonth"
                              value={values.expiryMonth}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              touched={touched.expiryMonth}
                              errors={errors.expiryMonth}
                              placeholder={t("common.allMonths")}
                              list={months}
                            />

                            <SelectionGroup
                              name="expiryYear"
                              value={values.expiryYear}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              touched={touched.expiryYear}
                              errors={errors.expiryYear}
                              placeholder={t("common.years")}
                              list={years}
                            />
                          </div>
                        </div>

                        <TextInputGroup
                          label={t("forms.cvc.name")}
                          type="text"
                          name="cvc"
                          inputMode="numeric"
                          value={values.cvc}
                          errors={errors.cvc}
                          touched={touched.cvc}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          minLength="3"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STC */}
              {/* <div className="flex flex-col transition-all duration-200 ease-in-out">
                <PaymentMethod
                  value={CONSTANT_VALUES.PAYMENT_METHODS.STC}
                  currentPaymentMethod={currentPaymentMethod}
                  label={t("forms.methods.stc")}
                  imagesList={stcImage}
                />

                {currentPaymentMethod ===
                  CONSTANT_VALUES.PAYMENT_METHODS.STC && (
                  <div className="flex flex-col gap-4 px-4 py-8 bg-[#FAF9F9] transition-all duration-200 ease-in-out">
                    <div className=" lg:w-[510px]">
                      {isFormSubmitted && showStcOtp ? (
                        <TextInputGroup
                          label={t("forms.stcOtp.name")}
                          type="text"
                          name="stcOtp"
                          inputMode="numeric"
                          value={values.stcOtp}
                          autoFocus
                          errors={errors.stcOtp}
                          touched={touched.stcOtp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          minLength="4"
                          maxLength="6"
                        />
                      ) : (
                        <TextInputGroup
                          label={t("forms.phone.name")}
                          type="tel"
                          name="stcPhoneNumber"
                          placeholder="05xxxxxxxx"
                          inputMode="numeric"
                          value={values.stcPhoneNumber}
                          errors={errors.stcPhoneNumber}
                          touched={touched.stcPhoneNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          minLength="10"
                          maxLength="10"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div> */}

              {/* tamara payment */}
              <div className="flex flex-col transition-all duration-200 ease-in-out">
                <PaymentMethod
                  value={CONSTANT_VALUES.PAYMENT_METHODS.TAMARA}
                  currentPaymentMethod={currentPaymentMethod}
                  label={t("forms.methods.tamara")}
                  imagesList={tamaraImage}
                />

                {currentPaymentMethod ===
                  CONSTANT_VALUES.PAYMENT_METHODS.TAMARA && (
                  <div className="flex flex-col gap-4 px-4 py-8 bg-[#FAF9F9] transition-all duration-200 ease-in-out">
                    <div className="lg:w-[510px]">
                      <div className="lg:w-[510px]">
                        <TamaraWidget
                          key="tamara-widget"
                          price={finalPrice}
                          publicKey={process.env.NEXT_PUBLIC_TAMARA_WIDGET_KEY}
                          currency="SAR"
                          paymentType="installment"
                        />
                      </div>

                      <div className="relative flex flex-col gap-2 mb-6">
                        <label className="font-medium capitalize font-ibm">
                          {t("forms.phone.name")}
                        </label>

                        <Field name="tamaraMobile">
                          {({ field }) => (
                            <PhoneInput
                              {...field}
                              international
                              countries={["SA", "AE", "BH", "KW", "OM"]}
                              defaultCountry="SA"
                              onCountryChange={(country) => {
                                setFieldValue("selectedCountry", country);
                              }}
                              value={values.tamaraMobile}
                              onChange={(value) => {
                                setFieldValue("tamaraMobile", value);
                              }}
                              errors={errors.tamaraMobile}
                              touched={touched.tamaraMobile}
                              onBlur={handleBlur}
                              id="tamaraMobile"
                              addInternationalOption={false}
                              style={{ direction: "ltr" }}
                              className={cn(
                                "flex bg-white lg:w-[510px] gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50  transition-all duration-200 ease-in-out",
                                errors.tamaraMobile && touched.tamaraMobile
                                  ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                                  : "border-border PhoneInputInput-focus:border-textDark hover:border-textDark"
                              )}
                            />
                          )}
                        </Field>
                        {errors.tamaraMobile && touched.tamaraMobile && (
                          <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                            {errors.tamaraMobile}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Apple pay */}
              {canMakePayments && (
                <div className="flex flex-col transition-all duration-200 ease-in-out">
                  <PaymentMethod
                    value={CONSTANT_VALUES.PAYMENT_METHODS.APPLE}
                    currentPaymentMethod={currentPaymentMethod}
                    label={t("forms.methods.applePay")}
                    imagesList={appleImage}
                  />

                  {currentPaymentMethod ===
                    CONSTANT_VALUES.PAYMENT_METHODS.APPLE && (
                    <div className="flex flex-col gap-4 px-4 py-8 bg-[#FAF9F9] transition-all duration-200 ease-in-out">
                      <div className="lg:w-[510px]">
                        {tripId !== "68c173a23e41d7d2a0845c78" ? (
                          <div className="flex lg:w-[510px]">
                            <AppleWidget key="apple-widget-main" baseData={baseData} />
                          </div>
                        ) : (
                          <>
                            <h2>Test</h2>
                            <div className="flex flex-col gap-4 px-4 py-8 bg-[#FAF9F9] transition-all duration-200 ease-in-out">
                              <div className="lg:w-[510px]">
                                <div className="flex lg:w-[510px]">
                                  <AppleWidgetTest key="apple-widget-test" baseData={baseData} />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </RadioGroup>

            {/* <PromoCodeForm /> */}

            <div className="flex-col w-full gap-2 centered">
              <button
                type="submit"
                disabled={!isValid || isSubmitting || disabledButton}
                className={`centered gap-5 lg:w-[540px] mt-8 lg:mt-12 lg:py-4 py-2 px-4 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor  bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                  isValid && "hover:bg-linksHover hover:border-linksHover"
                }`}
              >
                {isSubmitting ? (
                  <>
                    {t("forms.validation.sending")}

                    <CircularProgress size={25} sx={{ color: "#ED8A22" }} />
                  </>
                ) : currentPaymentMethod ===
                    CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD ||
                  currentPaymentMethod ===
                    CONSTANT_VALUES.PAYMENT_METHODS.TAMARA ||
                  currentPaymentMethod ===
                    CONSTANT_VALUES.PAYMENT_METHODS.APPLE ? (
                  t("links.confirmPayment")
                ) : isFormSubmitted && showStcOtp ? (
                  <>
                    {t("links.confirmPayment")}
                    {showCounter && (
                      <OtpCounter onComplete={() => setShowStcOtp(false)} />
                    )}
                  </>
                ) : (
                  t("links.sendStcOtp")
                )}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default PaymentForm;
