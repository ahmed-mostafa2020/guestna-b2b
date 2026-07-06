"use client";

import { useLocale, useTranslations } from "next-intl";
import { Formik } from "formik";
import { RadioGroup, Select, MenuItem, CircularProgress } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@utils/helpers/cn";
import formatCurrency from "@utils/formatters/FormatCurrency";
import ResponsiveGridLayout from "@components/ui/responsiveGridLayout";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import BookWithConfidenceSection from "@components/ui/trips/BookWithConfidenceSection";

import TextInputGroup from "@components/forms/TextInputGroup";
import PaymentMethod from "@components/forms/checkout/paymentForm/PaymentMethod";
import EventAppleWidget from "@components/forms/events/EventAppleWidget";
import TamaraWidget from "@components/forms/checkout/paymentForm/TamaraWidget";

import { CONSTANT_VALUES } from "@constants/constantValues";

const SelectionGroupWrapper = ({
  name,
  value,
  onChange,
  onBlur,
  touched,
  errors,
  placeholder,
  list,
}) => (
  <div className="flex-1">
    <Select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      displayEmpty
      sx={{ width: "100%", borderRadius: "8px" }}
    >
      <MenuItem value="" disabled>
        {placeholder}
      </MenuItem>
      {list.map((item) => (
        <MenuItem
          key={item}
          value={name === "expiryYear" ? item.toString().slice(-2) : item}
        >
          {item}
        </MenuItem>
      ))}
    </Select>
  </div>
);

// ── Left Side: Order Summary ──
const EventPaymentSummary = ({
  event,
  dynamicPrice,
  selectedOptionsBreakdown,
  rawDynamicPrice,
  promoDiscountAmount,
  appliedPromoCode,
  promoCodeInput,
  setPromoCodeInput,
  handleApplyPromoCode,
  handleRemovePromoCode,
  isPromoSubmitting,
  t,
}) => {
  return (
    <>
      <FrameWithImagedHeader withBorder={true}>
        <h3 className="text-xl font-semibold mb-4">
          {t("eventTrips.payment.orderSummary") || "Order Summary"}
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-somar">
            <span className="text-textLight font-medium">{event?.name}</span>
            <span className="text-textLight font-ibm">{event?.orderId}</span>
          </div>

          <hr className="border-border" />

          {selectedOptionsBreakdown.map((opt, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center font-somar text-sm text-textLight"
            >
              <span>
                {opt.fieldTitle}:{" "}
                <strong className="text-textDark font-medium">
                  {opt.label}
                </strong>
              </span>
              <span className="font-semibold font-ibm flex text-mainColor">
                + {formatCurrency(opt.price)}
              </span>
            </div>
          ))}

          <hr className="border-border" />

          {/* ── Promo Code Input ── */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-titleColor font-somar">
              {t("eventTrips.payment.promoCode.label") || "Promo Code"}
            </label>
            {appliedPromoCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="font-semibold font-ibm text-green-700 text-sm">
                    {appliedPromoCode.code}
                  </span>
                  <span className="flex text-green-600 text-xs font-somar">
                    (
                    {appliedPromoCode.discountType === "AMOUNT"
                      ? formatCurrency(appliedPromoCode.discount)
                      : `${appliedPromoCode.discount}%`}{" "}
                    {t("eventTrips.payment.promoCode.applied")})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromoCode}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold font-somar transition-colors duration-150"
                >
                  {t("eventTrips.payment.promoCode.remove") || "Remove"}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyPromoCode()}
                  placeholder={
                    t("eventTrips.payment.promoCode.placeholder") ||
                    "Enter promo code"
                  }
                  className="flex-1 p-3 text-sm border border-border rounded-xl outline-none font-ibm placeholder:text-textLight focus:border-mainColor hover:border-mainColor transition-colors duration-200 bg-white"
                />
                <button
                  type="button"
                  disabled={!promoCodeInput.trim() || isPromoSubmitting}
                  onClick={handleApplyPromoCode}
                  className="px-5 py-3 bg-mainColor text-white rounded-xl font-semibold font-somar text-sm hover:bg-linksHover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {isPromoSubmitting ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    t("eventTrips.payment.promoCode.apply") || "Apply"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ── Promo Discount Line ── */}
          {appliedPromoCode && (
            <div className="flex justify-between items-center font-somar text-sm">
              <span className="flex text-green-600 font-medium">
                {t("eventTrips.payment.promoCode.discount") || "Discount"} (
                {appliedPromoCode.discountType === "AMOUNT"
                  ? formatCurrency(appliedPromoCode.discount)
                  : `${appliedPromoCode.discount}%`}
                )
              </span>
              <span className="text-green-600 font-semibold font-ibm flex">
                - {formatCurrency(promoDiscountAmount)}
              </span>
            </div>
          )}

          <hr className="border-border" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-titleColor font-somar">
              {t("eventTrips.payment.total") || "Total"}
            </span>
            <div className="flex flex-col items-end gap-0.5">
              {appliedPromoCode && (
                <span className="relative inline-block text-gray-400 font-ibm text-xs">
                  {formatCurrency(rawDynamicPrice)}
                  <span
                    className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#ef4444] transform -rotate-[10deg] pointer-events-none"
                    style={{ transformOrigin: "center" }}
                  />
                </span>
              )}
              <span className="text-lg font-bold text-mainColor font-somar">
                {formatCurrency(dynamicPrice)}
              </span>
              <p className="text-xs text-textLight font-somar">
                {t("eventTrips.payment.includingVat") || "Including VAT"}
              </p>
            </div>
          </div>
        </div>
      </FrameWithImagedHeader>

      <BookWithConfidenceSection />
    </>
  );
};

// ── Right Side: Payment Form ──
const EventPaymentForm = ({
  paymentFormProps,
  currentPaymentMethod,
  handlePaymentMethodChange,
  creditImages,
  appleImage,
  tamaraImage,
  months,
  years,
  dynamicPrice,
  registrationValuesRef,
  buildAppleApiBody,
  handleBack,
  isPaymentSubmitting,
  t,
}) => {
  const {
    values: paymentValues,
    errors: paymentErrors,
    touched: paymentTouched,
    handleChange: handlePaymentChange,
    handleBlur: handlePaymentBlur,
    setFieldValue,
    isSubmitting,
    isValid,
    submitForm,
  } = paymentFormProps;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10 space-y-6 text-start">
      <RadioGroup
        value={currentPaymentMethod}
        onChange={handlePaymentMethodChange}
        className="flex flex-col w-full gap-4"
      >
        {/* Credit Card Option */}
        <div className="flex flex-col">
          <PaymentMethod
            value={CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD}
            currentPaymentMethod={currentPaymentMethod}
            label={t("forms.methods.credit")}
            imagesList={creditImages}
          />
          {currentPaymentMethod ===
            CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD && (
            <div className="px-4 py-6 bg-[#FAF9F9] rounded-b-xl flex flex-col gap-6">
              <TextInputGroup
                label={t("forms.cardholderName.name")}
                type="text"
                name="cardholderName"
                value={paymentValues.cardholderName}
                errors={paymentErrors.cardholderName}
                touched={paymentTouched.cardholderName}
                onChange={handlePaymentChange}
                onBlur={handlePaymentBlur}
                labelFontFamily="var(--font-somar-sans), sans-serif"
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
                labelFontFamily="var(--font-somar-sans), sans-serif"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-medium font-somar">
                    {t("forms.expirationDate.title")}
                  </label>
                  <div className="flex gap-3">
                    <SelectionGroupWrapper
                      name="expiryMonth"
                      value={paymentValues.expiryMonth}
                      onChange={handlePaymentChange}
                      onBlur={handlePaymentBlur}
                      touched={paymentTouched.expiryMonth}
                      errors={paymentErrors.expiryMonth}
                      placeholder={t("common.allMonths")}
                      list={months}
                    />
                    <SelectionGroupWrapper
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
                  labelFontFamily="var(--font-somar-sans), sans-serif"
                />
              </div>
            </div>
          )}
        </div>

        {/* Apple Pay Option */}
        <div className="flex flex-col">
          <PaymentMethod
            value={CONSTANT_VALUES.PAYMENT_METHODS.APPLE}
            currentPaymentMethod={currentPaymentMethod}
            label={t("forms.methods.applePay")}
            imagesList={appleImage}
          />
          {currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.APPLE && (
            <div className="px-4 py-6 bg-[#FAF9F9] rounded-b-xl">
              <EventAppleWidget
                key={dynamicPrice}
                baseData={buildAppleApiBody(registrationValuesRef.current)}
                price={dynamicPrice}
              />
            </div>
          )}
        </div>

        {/* Tamara Option */}
        <div className="flex flex-col">
          <PaymentMethod
            value={CONSTANT_VALUES.PAYMENT_METHODS.TAMARA}
            currentPaymentMethod={currentPaymentMethod}
            label={t("forms.methods.tamara")}
            imagesList={tamaraImage}
          />
          {currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.TAMARA && (
            <div className="px-4 py-8 bg-[#FAF9F9] rounded-b-xl flex flex-col gap-4">
              <TamaraWidget
                price={dynamicPrice}
                publicKey={process.env.NEXT_PUBLIC_TAMARA_WIDGET_KEY}
                currency="SAR"
                paymentType="installment"
              />
              <div className="relative w-full">
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
                  onChange={(val) => setFieldValue("tamaraMobile", val || "")}
                  onBlur={handlePaymentBlur}
                  id="tamaraMobile"
                  addInternationalOption={false}
                  style={{ direction: "ltr" }}
                  className={cn(
                    "flex w-full bg-white gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background font-somar text-lg placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed transition-all duration-200 ease-in-out",
                    paymentErrors.tamaraMobile && paymentTouched.tamaraMobile
                      ? "border-error"
                      : "border-border"
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </RadioGroup>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          type="button"
          disabled={isSubmitting || isPaymentSubmitting || !isValid}
          onClick={submitForm}
          className="sm:flex-1 py-3.5 px-6 bg-mainColor text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 font-somar shadow-md hover:shadow-lg hover:bg-linksHover transition-all duration-200"
        >
          {isSubmitting || isPaymentSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            t("eventTrips.payment.confirm")
          )}
        </button>
        <button
          type="button"
          onClick={handleBack}
          className="sm:flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 font-somar"
        >
          {t("pagination.previous")}
        </button>
      </div>
    </div>
  );
};

// ── Main Page Layout Component ──
const EventCheckoutGrid = ({
  event,
  dynamicPrice,
  selectedOptionsBreakdown,
  rawDynamicPrice,
  promoDiscountAmount,
  appliedPromoCode,
  promoCodeInput,
  setPromoCodeInput,
  handleApplyPromoCode,
  handleRemovePromoCode,
  isPromoSubmitting,
  currentPaymentMethod,
  handlePaymentMethodChange,
  creditSchema,
  tamaraSchema,
  paymentInitialValues,
  creditImages,
  appleImage,
  tamaraImage,
  months,
  years,
  buildAppleApiBody,
  registrationValuesRef,
  isPaymentSubmitting,
  handlePaymentSubmit,
  handleBack,
}) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <Formik
      initialValues={paymentInitialValues}
      validationSchema={
        currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
          ? creditSchema
          : currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.TAMARA
            ? tamaraSchema
            : undefined
      }
      onSubmit={handlePaymentSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {(formikProps) => (
        <ResponsiveGridLayout
          LargeSizeGrid={EventPaymentSummary}
          SmallSizeGrid={EventPaymentForm}
          largeGridPercent={4.75}
          smallGridPercent={7.25}
          largeSizeProps={{
            event,
            dynamicPrice,
            selectedOptionsBreakdown,
            rawDynamicPrice,
            promoDiscountAmount,
            appliedPromoCode,
            promoCodeInput,
            setPromoCodeInput,
            handleApplyPromoCode,
            handleRemovePromoCode,
            isPromoSubmitting,
            t,
          }}
          smallSizeProps={{
            paymentFormProps: formikProps,
            currentPaymentMethod,
            handlePaymentMethodChange,
            creditImages,
            appleImage,
            tamaraImage,
            months,
            years,
            dynamicPrice,
            registrationValuesRef,
            buildAppleApiBody,
            handleBack,
            isPaymentSubmitting,
            t,
          }}
        />
      )}
    </Formik>
  );
};

export default EventCheckoutGrid;
