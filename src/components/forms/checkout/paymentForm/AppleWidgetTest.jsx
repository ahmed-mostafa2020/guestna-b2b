"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { memo, useEffect, useState, useRef } from "react";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { useMutationDataTest } from "@hooks/data/useMutationDataTest";
import { useSnackbar } from "notistack";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

const AppleWidgetTest = ({ baseData, currency = "SAR" }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const bookingIdRef = useRef(null); // Use ref to store bookingId immediately
  const isInitializedRef = useRef(false);
  const widgetContainerRef = useRef(null);

  const price = useSelector(
    (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
  );

  const discountedPrice = useSelector(
    (state) => state.promoCode?.promoCodeData?.trip?.discountedTotalPriceWithVat
  );

  const finalPrice = discountedPrice ? discountedPrice : price;

  const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  const { mutate } = useMutationDataTest(
    B2B_END_POINTS.TEST_APPLE_BOOKING.INITIATE,
    {
      method: "POST", // Specify POST
    }
  );

  const { mutate: mutateComferm } = useMutationDataTest(
    B2B_END_POINTS.TEST_APPLE_BOOKING.CONFIRM,
    {
      method: "POST", // Specify POST
    }
  );

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      return;
    }

    // Ensure Moyasar is available
    if (typeof window === "undefined" || !window.Moyasar) {
      console.error("Moyasar is not available");
      return;
    }

    // Mark as initialized before calling init
    isInitializedRef.current = true;

    try {
      Moyasar.init({
        element: ".mysr-form",
        amount: +finalPrice * 100,
        language: locale,
        currency: currency,
        description: tripName,
        publishable_api_key: appleWidgetKey,
        callback_url: `${B2B_END_POINTS.PAYMENTS}${B2B_END_POINTS.TEST_APPLE_BOOKING.CALLBACK}?lang=${locale}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
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
                    return; // Stop execution here
                  }
                  // Store in both state and ref for immediate access
                  bookingIdRef.current = data.bookingId;
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
              enqueueSnackbar(
                error?.message ||
                  error?.response?.data?.message ||
                  t("forms.validation.error"),
                {
                  variant: "error",
                }
              );
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
                  bookingId: bookingIdRef.current, // Use ref value for immediate access
                  paymentId: payment.id,
                };
                mutateComferm(confirmationData, {
                  onSuccess: () => {
                    bookingIdRef.current = null; // Clear ref
                    setCurrentBookingId("");
                    // Don't show snackbar here - user will be redirected via callback_url
                    // Success message will be shown on the booking status page
                    resolve({});
                  },
                  onError: (error) => {
                    enqueueSnackbar(
                      error?.message ||
                        error?.response?.data?.message ||
                        t("forms.validation.error"),
                      {
                        variant: "error",
                      }
                    );
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
              enqueueSnackbar(
                error?.message ||
                  error?.response?.data?.message ||
                  t("forms.validation.error"),
                {
                  variant: "error",
                }
              );
              reject();
            }
          });
        },
      });
    } catch (error) {
      console.error("Error initializing Moyasar:", error);
      isInitializedRef.current = false;
    }

    // Cleanup function
    return () => {
      // Clear the widget container to prevent DOM conflicts
      if (widgetContainerRef.current) {
        try {
          widgetContainerRef.current.innerHTML = "";
        } catch (error) {
          console.error("Error cleaning up widget:", error);
        }
      }
      isInitializedRef.current = false;
    };
  }, []);

  return (
    <div className="flex" ref={widgetContainerRef}>
      <div className="mysr-form"></div>
    </div>
  );
};

export default memo(AppleWidgetTest);
