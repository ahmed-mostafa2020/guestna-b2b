"use client";

import { useLocale } from "next-intl";
import { memo, useEffect, useState } from "react";
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

const GraduationAppleWidget = ({ baseData, price }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const locale = useLocale();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  const { mutate } = useMutationData(
    B2B_END_POINTS.GRADUATION.APPLE_INITIATE,
    { method: "POST" }
  );

  const { mutate: mutateConfirm } = useMutationData(
    B2B_END_POINTS.GRADUATION.APPLE_CONFIRM,
    { method: "POST" }
  );

  useEffect(() => {
    Moyasar.init({
      element: ".graduation-mysr-form",
      amount: price * 100,
      language: locale,
      currency: "SAR",
      description: "Graduation Suit Registration",
      publishable_api_key: appleWidgetKey,
      callback_url: `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.GRADUATION.APPLE_CALLBACK}?lang=${locale}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
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
            mutate(baseData, {
              onSuccess: (data) => {
                if (!data?.bookingId) {
                  enqueueSnackbar("issue at generate Id", { variant: "error" });
                  reject();
                  return;
                }
                setCurrentBookingId(data.bookingId);
                resolve({});
              },
              onError: (error) => {
                enqueueSnackbar(
                  extractBackendError(error, "on error generate Id"),
                  { variant: "error" }
                );
                reject();
              },
            });
          } catch (error) {
            enqueueSnackbar("on error Initiation", { variant: "error" });
            reject();
          }
        });
      },
      on_completed: function (payment) {
        return new Promise(function (resolve, reject) {
          try {
            if (payment && payment.id) {
              const confirmationData = {
                bookingId: currentBookingId,
                paymentId: payment.id,
              };
              mutateConfirm(confirmationData, {
                onSuccess: () => {
                  setCurrentBookingId("");
                  resolve({});
                },
                onError: (error) => {
                  enqueueSnackbar(
                    extractBackendError(error, "error to confirmed"),
                    { variant: "error" }
                  );
                  reject();
                },
              });
            } else {
              enqueueSnackbar("failed generate paymentId", { variant: "error" });
              reject();
            }
          } catch (error) {
            enqueueSnackbar("failed on complete", { variant: "error" });
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
    vercelUrl,
    price,
  ]);

  return <div className="graduation-mysr-form" />;
};

export default memo(GraduationAppleWidget);
