"use client";

import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { memo, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
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
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app") ||
    host.endsWith(".netlify.app")
  );
};

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const showDebugInitiate = useMemo(() => isTestEnvironment(), []);

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
    {
      method: "POST", // Specify POST
    }
  );

  const handleDebugInitiate = () => {
    try {
      mutate(baseData, {
        onSuccess: (data) => {
          if (!data?.bookingId) {
            enqueueSnackbar("issue at generate Id", { variant: "error" });
            return;
          }
          setCurrentBookingId(data.bookingId);
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

  const { mutate: mutateComferm } = useMutationData(
    B2B_END_POINTS.APPLE_BOOKING.CONFIRM,
    {
      method: "POST", // Specify POST
    }
  );

  useEffect(() => {
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
        return new Promise(function (resolve, reject) {
          try {
            // Call the initiation endpoint
            mutate(baseData, {
              onSuccess: (data) => {
                if (!data?.bookingId) {
                  alert("issue at generate Id");
                  reject();
                }
                setCurrentBookingId(data.bookingId);
                resolve({});
              },
              onError: (error) => {
                alert("on error generate Id");

                reject();
              },
            });
          } catch (error) {
            alert("on error Initiation");
            reject();
          }
        });
      },
      on_completed: function (payment) {
        return new Promise(function (resolve, reject) {
          try {
            if (payment && payment.id) {
              // Call the confirmation endpoint
              const confirmationData = {
                trip: baseData.trip,
                bookingId: currentBookingId, // Use ref value instead of state
                paymentId: payment.id,
              };
              mutateComferm(confirmationData, {
                onSuccess: () => {
                  setCurrentBookingId("");
                  resolve({});
                },
                onError: (error) => {
                  alert("error to confirmed");
                  reject();
                },
              });
            } else {
              alert("faild generate paymentId");

              reject();
            }
          } catch (error) {
            alert("faild on complete");
            reject();
          }
        });
      },
    });
  }, [
    currentBookingId,
    setCurrentBookingId,
    locale,
    baseData,
    appleWidgetKey,
    currency,
    vercelUrl,
    finalPrice,
    tripName,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="mysr-form"></div>
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
