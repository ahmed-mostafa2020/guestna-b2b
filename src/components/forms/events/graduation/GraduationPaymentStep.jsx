"use client";

import { useTranslations, useLocale } from "next-intl";
import { RadioGroup } from "@mui/material";
import { CONSTANT_VALUES } from "@constants/constantValues";
import formatCurrency from "@utils/formatters/FormatCurrency";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import PaymentMethod from "@components/forms/checkout/paymentForm/PaymentMethod";
import GraduationAppleWidget from "./GraduationAppleWidget";
import TamaraWidget from "@components/forms/checkout/paymentForm/TamaraWidget";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@utils/helpers/cn";

import madaLogo from "@assets/paymentLogos/mada.svg";
import visaLogo from "@assets/paymentLogos/visa.svg";
import mastercardLogo from "@assets/paymentLogos/master-card.svg";
import amExpressLogo from "@assets/paymentLogos/amExpress.png";
import applePay from "@assets/paymentLogos/apple-pay.svg";
import tamaraArabic from "@assets/paymentLogos/tamaraArabic.jpg";
import tamaraEnglish from "@assets/paymentLogos/tamaraEnglish.svg";

const GraduationPaymentStep = ({
  values,
  paymentValues,
  paymentErrors,
  paymentTouched,
  handlePaymentChange,
  handlePaymentBlur,
  setFieldValue,
  currentPaymentMethod,
  onPaymentMethodChange,
  applePayBaseData,
  price,
  suitInfo,
  branch,
  stages,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const currentYear = new Date().getFullYear();

  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const years = Array.from({ length: 7 }, (_, i) => currentYear + i);

  const creditImages = [
    { image: madaLogo, name: "mada" },
    { image: visaLogo, name: "Visa" },
    { image: mastercardLogo, name: "mastercard" },
    { image: amExpressLogo, name: "American Express" },
  ];

  const appleImage = [{ image: applePay, name: "apple pay" }];

  const tamaraImage = [
    { image: locale === "ar" ? tamaraArabic : tamaraEnglish, name: "tamara" },
  ];

  const selectedStageName = values.academicStage || "";

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-somar">
          {t("graduation.payment.title")}
        </h2>
        <p className="text-gray-500 text-sm md:text-base mt-1 font-somar">
          {t("graduation.payment.subtitle")}
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-[#faf8f4] rounded-xl p-5 md:p-6 border border-[#d4a853]/20">
        <h3 className="text-base font-semibold text-gray-900 font-somar mb-3">
          {t("graduation.payment.orderSummary")}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-somar">
            <span className="text-gray-500">{values.name}</span>
            <span className="text-gray-500">
              {branch === "AL_ARID"
                ? t("graduation.branches.arid")
                : t("graduation.branches.atiq")}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm font-somar">
            <span className="text-gray-500">
              {t("graduation.form.stage.label")}
            </span>
            <span className="text-gray-500">{selectedStageName}</span>
          </div>
          {suitInfo && (
            <div className="flex justify-between items-center text-sm font-somar">
              <span className="text-gray-500">
                {t("graduation.suit.suitLabel")}
              </span>
              <span className="text-gray-500 font-medium">
                {t(`graduation.suit.${suitInfo.suitColor}`)}
              </span>
            </div>
          )}
          {values.clothesSize && (
            <div className="flex justify-between items-center text-sm font-somar">
              <span className="text-gray-500">
                {t("graduation.form.clothesSize.label")}
              </span>
              <span className="text-gray-500">{values.clothesSize}</span>
            </div>
          )}
          <hr className="border-[#d4a853]/20" />
          <div className="flex justify-between items-center font-somar">
            <span className="text-gray-700">
              {t("graduation.payment.suitFee")}
            </span>
            <span className="text-gray-700 font-semibold">
              {formatCurrency(price)}
            </span>
          </div>
          <hr className="border-[#d4a853]/20" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900 font-somar">
              {t("graduation.payment.total")}
            </span>
            <div className="text-end">
              <span className="text-lg font-bold text-[#d4a853] font-somar flex justify-end">
                {formatCurrency(price)}
              </span>
              <p className="text-xs text-gray-400 font-somar">
                {t("graduation.payment.includingVat")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 font-somar pb-4">
          {t("forms.paymentMethodsForm.subTitle")}
        </h3>

        <RadioGroup
          value={currentPaymentMethod}
          onChange={onPaymentMethodChange}
          name="payment-method"
          className="flex flex-col w-full gap-4"
        >
          {/* Credit Card */}
          <div className="flex flex-col transition-all duration-200 ease-in-out">
            <PaymentMethod
              value={CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD}
              currentPaymentMethod={currentPaymentMethod}
              label={t("forms.methods.credit")}
              imagesList={creditImages}
            />

            {currentPaymentMethod ===
              CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD && (
              <div className="px-4 py-6 bg-[#FAF9F9] rounded-b-xl transition-all duration-200 ease-in-out">
                <div className="flex flex-col gap-6">
                  <TextInputGroup
                    label={t("forms.cardholderName.name")}
                    type="text"
                    name="cardholderName"
                    value={paymentValues.cardholderName}
                    errors={paymentErrors.cardholderName}
                    touched={paymentTouched.cardholderName}
                    onChange={handlePaymentChange}
                    onBlur={handlePaymentBlur}
                  />

                  <TextInputGroup
                    label={t("forms.cardNumber.name")}
                    type="text"
                    name="cardNumber"
                    inputMode="numeric"
                    value={paymentValues.cardNumber}
                    errors={paymentErrors.cardNumber}
                    touched={paymentTouched.cardNumber}
                    onChange={handlePaymentChange}
                    onBlur={handlePaymentBlur}
                    minLength="15"
                    maxLength="16"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col justify-between gap-2">
                      <label className="font-medium font-somar">
                        {t("forms.expirationDate.title")}
                      </label>
                      <div className="flex gap-3">
                        <SelectionGroup
                          name="expiryMonth"
                          value={paymentValues.expiryMonth}
                          onChange={handlePaymentChange}
                          onBlur={handlePaymentBlur}
                          touched={paymentTouched.expiryMonth}
                          errors={paymentErrors.expiryMonth}
                          placeholder={t("common.allMonths")}
                          list={months}
                        />
                        <SelectionGroup
                          name="expiryYear"
                          value={paymentValues.expiryYear}
                          onChange={handlePaymentChange}
                          onBlur={handlePaymentBlur}
                          touched={paymentTouched.expiryYear}
                          errors={paymentErrors.expiryYear}
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
                      value={paymentValues.cvc}
                      errors={paymentErrors.cvc}
                      touched={paymentTouched.cvc}
                      onChange={handlePaymentChange}
                      onBlur={handlePaymentBlur}
                      minLength="3"
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Apple Pay */}
          <div className="flex flex-col transition-all duration-200 ease-in-out">
            <PaymentMethod
              value={CONSTANT_VALUES.PAYMENT_METHODS.APPLE}
              currentPaymentMethod={currentPaymentMethod}
              label={t("forms.methods.applePay")}
              imagesList={appleImage}
            />

            {currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.APPLE && (
              <div className="flex flex-col gap-4 px-4 py-6 bg-[#FAF9F9] rounded-b-xl transition-all duration-200 ease-in-out">
                <GraduationAppleWidget
                  key={`graduation-apple-widget-${price}`}
                  baseData={applePayBaseData}
                  price={price}
                />
              </div>
            )}
          </div>

          {/* Tamara */}
          <div className="flex flex-col transition-all duration-200 ease-in-out max-w-[300px] lg:max-w-full">
            <PaymentMethod
              value={CONSTANT_VALUES.PAYMENT_METHODS.TAMARA}
              currentPaymentMethod={currentPaymentMethod}
              label={t("forms.methods.tamara")}
              imagesList={tamaraImage}
            />

            {currentPaymentMethod ===
              CONSTANT_VALUES.PAYMENT_METHODS.TAMARA && (
              <div className="flex flex-col gap-4 px-4 py-8 bg-[#FAF9F9] rounded-b-xl overflow-hidden transition-all duration-200 ease-in-out">
                <div className="w-full max-w-full overflow-hidden">
                  <TamaraWidget
                    price={price}
                    publicKey={process.env.NEXT_PUBLIC_TAMARA_WIDGET_KEY}
                    currency="SAR"
                    paymentType="installment"
                  />
                </div>

                <div className="relative">
                  <label className="block font-medium font-somar mb-2">
                    {t("forms.phone.name")}
                  </label>
                  <PhoneInput
                    countries={["SA", "AE", "BH", "KW", "OM"]}
                    defaultCountry="SA"
                    onCountryChange={(country) => {
                      setFieldValue("selectedCountry", country);
                    }}
                    value={paymentValues.tamaraMobile}
                    onChange={(value) => {
                      setFieldValue("tamaraMobile", value || "");
                    }}
                    onBlur={handlePaymentBlur}
                    id="tamaraMobile"
                    addInternationalOption={false}
                    style={{ direction: "ltr" }}
                    className={cn(
                      "flex w-full bg-white gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background font-somar text-lg placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed transition-all duration-200 ease-in-out",
                      paymentErrors.tamaraMobile && paymentTouched.tamaraMobile
                        ? "border-error"
                        : "border-border hover:border-textDark"
                    )}
                  />
                  {paymentErrors.tamaraMobile &&
                    paymentTouched.tamaraMobile && (
                      <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                        {paymentErrors.tamaraMobile}
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default GraduationPaymentStep;
