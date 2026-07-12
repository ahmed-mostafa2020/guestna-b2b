"use client";

import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { useMutationData } from "@hooks/data/useMutationData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

const extractBackendError = (error, fallback) => {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (Array.isArray(data.info) && data.info.length > 0) {
    return data.info.map((i) => i.message).filter(Boolean).join(" | ");
  }
  return data.message || fallback;
};

const isTestEnvironment = () => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host !== "guestna-edu.com" && host !== "www.guestna-edu.com";
};

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const { enqueueSnackbar } = useSnackbar();
  const showDebugInitiate = useMemo(() => isTestEnvironment(), []);

  const bookingIdRef = useRef(null);
  const isInitializedRef = useRef(false);
  const widgetContainerRef = useRef(null);
  const baseDataRef = useRef(baseData);
  const [isProcessing, setIsProcessing] = useState(false);

  const price = useSelector(
    (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
  );
  const discountedPrice = useSelector(
    (state) => state.promoCode?.promoCodeData?.trip?.discountedTotalPriceWithVat
  );

  const finalPrice = discountedPrice ? discountedPrice : price;

  const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

  const locale = useLocale();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  const { mutate, isLoading: isInitiating } = useMutationData(
    B2B_END_POINTS.APPLE_BOOKING.INITIATE,
    { method: "POST" }
  );

  const { mutate: mutateComferm } = useMutationData(
    B2B_END_POINTS.APPLE_BOOKING.CONFIRM,
    { method: "POST" }
  );

  // Keep latest baseData accessible inside Moyasar callbacks without re-init
  useEffect(() => {
    baseDataRef.current = baseData;
  }, [baseData]);

  const handleDebugInitiate = () => {
    try {
      mutate({
        ...baseDataRef.current,
        price: +finalPrice
      }, {
        onSuccess: (data) => {
          if (!data?.bookingId) {
            enqueueSnackbar("issue at generate Id", { variant: "error" });
            return;
          }
          bookingIdRef.current = data.bookingId;
          enqueueSnackbar(`Initiation success: ${data.bookingId}`, {
            variant: "success",
          });
        },
        onError: (error) => {
          enqueueSnackbar(
            extractBackendError(error, "on error generate Id"),
            { variant: "error" }
          );
        },
      });
    } catch (error) {
      enqueueSnackbar("on error Initiation", { variant: "error" });
    }
  };

  useEffect(() => {
    if (isInitializedRef.current) return;
    if (typeof window === "undefined" || !window.Moyasar) return;

    isInitializedRef.current = true;

    try {
      Moyasar.init({
        element: ".mysr-form",
        amount: +finalPrice * 100,
        language: locale,
        currency: currency,
        description: tripName,
        publishable_api_key: appleWidgetKey,
        callback_url: `${B2B_END_POINTS.PAYMENTS}${B2B_END_POINTS.APPLE_BOOKING.CALLBACK}?lang=${locale}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
        methods: ["applepay"],
        apple_pay: {
          country: "SA",
          label: "Guestna",
          merchant_capabilities: [
            "supports3DS",
            "supportsCredit",
            "supportsDebit",
          ],
          supported_countries: ["SA", "US"],
          validation_url:
            "https://apple-pay-gateway.apple.com/paymentservices/paymentSession",
          validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
        },
        on_initiating: function () {
          setIsProcessing(true);
          return new Promise(function (resolve, reject) {
            try {
              mutate({
                ...baseDataRef.current,
                price: +finalPrice
              }, {
                onSuccess: (data) => {
                  if (!data?.bookingId) {
                    enqueueSnackbar("issue at generate Id", { variant: "error" });
                    setIsProcessing(false);
                    reject();
                    return;
                  }
                  bookingIdRef.current = data.bookingId;
                  resolve({});
                },
                onError: (error) => {
                  enqueueSnackbar(
                    extractBackendError(error, "on error generate Id"),
                    { variant: "error" }
                  );
                  setIsProcessing(false);
                  reject();
                },
              });
            } catch (error) {
              enqueueSnackbar("on error Initiation", { variant: "error" });
              setIsProcessing(false);
              reject();
            }
          });
        },
        on_completed: function (payment) {
          return new Promise(function (resolve, reject) {
            try {
              if (payment && payment.id) {
                const confirmationData = {
                  trip: baseDataRef.current?.trip,
                  bookingId: bookingIdRef.current,
                  paymentId: payment.id,
                };
                mutateComferm(confirmationData, {
                  onSuccess: () => {
                    bookingIdRef.current = null;
                    resolve({});
                  },
                  onError: (error) => {
                    enqueueSnackbar(
                      extractBackendError(error, "error to confirmed"),
                      { variant: "error" }
                    );
                    setIsProcessing(false);
                    reject();
                  },
                });
              } else {
                enqueueSnackbar("faild generate paymentId", { variant: "error" });
                setIsProcessing(false);
                reject();
              }
            } catch (error) {
              enqueueSnackbar("faild on complete", { variant: "error" });
              setIsProcessing(false);
              reject();
            }
          });
        },
      });
    } catch (error) {
      console.error("Error initializing Moyasar:", error);
      isInitializedRef.current = false;
    }

    return () => {
      if (widgetContainerRef.current) {
        try {
          widgetContainerRef.current.innerHTML = "";
        } catch (error) {
          console.error("Error cleaning up widget:", error);
        }
      }
      isInitializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative" ref={widgetContainerRef}>
        <div className="mysr-form"></div>
        {isProcessing && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl cursor-not-allowed"
            style={{ pointerEvents: "all" }}
            aria-busy="true"
          >
            <CircularProgress size={32} sx={{ color: "#ED8A22" }} />
          </div>
        )}
      </div>
      {showDebugInitiate && (
        <button
          type="button"
          onClick={handleDebugInitiate}
          disabled={isInitiating}
          className="w-full py-3 px-6 border-2 border-amber-400 text-amber-700 bg-amber-50 rounded-xl font-somar font-semibold hover:bg-amber-100 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitiating ? "Initiating..." : "Test Initiate (debug)"}
        </button>
      )}
    </div>
  );
};

export default memo(AppleWidget);
