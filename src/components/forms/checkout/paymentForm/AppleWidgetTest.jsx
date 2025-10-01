"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { memo, useEffect, useState, useRef } from "react";
import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import axios from "axios";
import { useMutationDataTest } from "@hooks/useMutationDataTest";
import { useSnackbar } from "notistack";

const AppleWidgetTest = ({ baseData, currency = "SAR" }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);

  const price = useSelector(
    (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
  );

  const discountedPrice = useSelector(
    (state) => state.finalTripDetailsData.data.discountedTotalPriceWithVat
  );

  const finalPrice = discountedPrice ? discountedPrice : price;

  const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  const { mutate } = useMutationDataTest("bookings/initiation/apple", {
    method: "POST", // Specify POST
  });

  const { mutate: mutateComferm } = useMutationDataTest(
    "bookings/confermed/apple",
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
      callback_url: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CALLBACK}?lang=${locale}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
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
                  enqueueSnackbar(t("forms.validation.error"), {
                    variant: "error",
                  });
                  reject();
                }
                setCurrentBookingId(data.bookingId);
                resolve({});
              },
              onError: (error) => {
                enqueueSnackbar(t("forms.validation.error"), {
                  variant: "error",
                });
                reject();
              },
            });
          } catch (error) {
            enqueueSnackbar(error || t("forms.validation.error"), {
              variant: "error",
            });
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
                  enqueueSnackbar(t("forms.validation.success"), {
                    variant: "success",
                  });
                  resolve({});
                },
                onError: (error) => {
                  enqueueSnackbar(error || t("forms.validation.error"), {
                    variant: "error",
                  });
                  reject();
                },
              });
            } else {
              enqueueSnackbar(
                "faild generate paymentId" || t("forms.validation.error"),
                {
                  variant: "error",
                }
              );
              reject();
            }
          } catch (error) {
            enqueueSnackbar(error || t("forms.validation.error"), {
              variant: "error",
            });
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

  // const testInitiation = () => {
  //   console.log("🧪 Testing Apple Pay Initiation...");
  //   console.log("Base Data:", baseData);

  //   mutate(baseData, {
  //     onSuccess: (data) => {
  //       console.log("✅ Initiation Success:", data);
  //       enqueueSnackbar("Test Initiation Success: " + JSON.stringify(data), {
  //         variant: "success",
  //       });
  //       if (data?.bookingId) {
  //         setCurrentBookingId(data.bookingId);
  //       }
  //     },
  //     onError: (error) => {
  //       console.error("❌ Initiation Error:", error);
  //       enqueueSnackbar(
  //         "Test Initiation Error: " + (error?.message || JSON.stringify(error)),
  //         {
  //           variant: "error",
  //         }
  //       );
  //     },
  //   });
  // };

  return (
    <div className="flex">
      <div className="mysr-form"></div>

      {/* {process.env.NODE_ENV === "development" && (
        <div className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-sm">Apple Pay Debug Tools</h4>
          <div className="flex gap-2">
            <button
              onClick={testInitiation}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Test Initiation API
            </button>
          </div>
          <div className="text-xs text-gray-600">
            <p>Current Booking ID: {currentBookingId || "None"}</p>
            <p>
              Price: {price} {currency}
            </p>
            <p>Trip Name: {tripName}</p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default memo(AppleWidgetTest);
