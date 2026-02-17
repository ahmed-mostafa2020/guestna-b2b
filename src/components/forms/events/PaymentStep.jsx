"use client";

import { useTranslations } from "next-intl";
import { RadioGroup } from "@mui/material";
import { CONSTANT_VALUES } from "@constants/constantValues";
import formatCurrency from "@utils/FormatCurrency";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import PaymentMethod from "@components/forms/checkout/paymentForm/PaymentMethod";
import RamadanAppleWidget from "./RamadanAppleWidget";

import madaLogo from "@assets/paymentLogos/mada.svg";
import visaLogo from "@assets/paymentLogos/visa.svg";
import mastercardLogo from "@assets/paymentLogos/master-card.svg";
import amExpressLogo from "@assets/paymentLogos/amExpress.png";
import applePay from "@assets/paymentLogos/apple-pay.svg";

const BOOTH_FEE = 50;

const PaymentStep = ({
  values,
  paymentValues,
  paymentErrors,
  paymentTouched,
  handlePaymentChange,
  handlePaymentBlur,
  currentPaymentMethod,
  onPaymentMethodChange,
  applePayBaseData,
}) => {
  const t = useTranslations();

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

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-titleColor font-somar">
          {t("ramadanNights.payment.title")}
        </h2>
        <p className="text-textLight text-sm md:text-base mt-1 font-somar">
          {t("ramadanNights.payment.subtitle")}
        </p>
      </div>

      {/* Vendor Summary Card */}
      <div className="bg-activityDetailsBg rounded-xl p-5 md:p-6 border border-border">
        <h3 className="text-base font-semibold text-titleColor font-somar mb-3">
          {t("ramadanNights.payment.orderSummary")}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-somar">
            <span className="text-textLight">{values.fullName}</span>
            <span className="text-textLight">{values.email}</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between items-center font-somar">
            <span className="text-textDark">
              {t("ramadanNights.payment.boothRegistration")}
            </span>
            <span className="text-textDark font-semibold">
              {formatCurrency(BOOTH_FEE)}
            </span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-titleColor font-somar">
              {t("ramadanNights.payment.total")}
            </span>
            <div className="text-end">
              <span className="text-lg font-bold text-mainColor font-somar flex justify-end">
                {formatCurrency(BOOTH_FEE)}
              </span>
              <p className="text-xs text-textLight font-somar">
                {t("ramadanNights.payment.includingVat")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h3 className="text-base font-semibold text-titleColor font-somar pb-4">
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
                <RamadanAppleWidget baseData={applePayBaseData} />
              </div>
            )}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default PaymentStep;
