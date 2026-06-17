"use client";

import { useLocale } from "next-intl";
import { memo, useEffect, useRef, useState } from "react";
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

const EventAppleWidget = ({ baseData, price = 0 }) => {
  const { enqueueSnackbar } = useSnackbar();

  const bookingIdRef = useRef(null);
  const isInitializedRef = useRef(false);
  const widgetContainerRef = useRef(null);
  const baseDataRef = useRef(baseData);
  const priceRef = useRef(price);
  const [isProcessing, setIsProcessing] = useState(false);

  const locale = useLocale();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  const { mutate } = useMutationData(
    B2B_END_POINTS.EVENT_BOOKING.APPLE_INITIATE,
    { method: "POST" }
  );

  const { mutate: mutateConfirm } = useMutationData(
    B2B_END_POINTS.EVENT_BOOKING.APPLE_CONFIRM,
    { method: "POST" }
  );

  useEffect(() => {
    baseDataRef.current = baseData;
  }, [baseData]);

  useEffect(() => {
    priceRef.current = price;
  }, [price]);

  useEffect(() => {
    if (isInitializedRef.current) return;
    if (typeof window === "undefined" || !window.Moyasar) return;

    isInitializedRef.current = true;

    try {
      Moyasar.init({
        element: ".mysr-form",
        amount: priceRef.current * 100,
        language: locale,
        currency: "SAR",
        description: "Event Registration & Booking Fee",
        publishable_api_key: appleWidgetKey,
        callback_url: `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.EVENT_BOOKING.APPLE_CALLBACK}?lang=${locale}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
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
              mutate(baseDataRef.current, {
                onSuccess: (data) => {
                  if (!data?.bookingId) {
                    enqueueSnackbar("Issue generating booking ID", { variant: "error" });
                    setIsProcessing(false);
                    reject();
                    return;
                  }
                  bookingIdRef.current = data.bookingId;
                  resolve({});
                },
                onError: (error) => {
                  enqueueSnackbar(
                    extractBackendError(error, "Error initiating payment ID"),
                    { variant: "error" }
                  );
                  setIsProcessing(false);
                  reject();
                },
              });
            } catch (error) {
              enqueueSnackbar("Error initiating payment", { variant: "error" });
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
                  bookingId: bookingIdRef.current,
                  paymentId: payment.id,
                };
                mutateConfirm(confirmationData, {
                  onSuccess: () => {
                    bookingIdRef.current = null;
                    resolve({});
                  },
                  onError: (error) => {
                    enqueueSnackbar(
                      extractBackendError(error, "Error confirming payment"),
                      { variant: "error" }
                    );
                    setIsProcessing(false);
                    reject();
                  },
                });
              } else {
                enqueueSnackbar("Failed to generate payment ID", { variant: "error" });
                setIsProcessing(false);
                reject();
              }
            } catch (error) {
              enqueueSnackbar("Failed on complete", { variant: "error" });
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
    </div>
  );
};

export default memo(EventAppleWidget);
