"use client";

import { useLocale } from "next-intl";
import { memo, useEffect, useState } from "react";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { useMutationData } from "@hooks/data/useMutationData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

const GraduationAppleWidget = ({ baseData, price }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);

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
                  alert("issue at generate Id");
                  reject();
                  return;
                }
                setCurrentBookingId(data.bookingId);
                resolve({});
              },
              onError: () => {
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
              const confirmationData = {
                bookingId: currentBookingId,
                paymentId: payment.id,
              };
              mutateConfirm(confirmationData, {
                onSuccess: () => {
                  setCurrentBookingId("");
                  resolve({});
                },
                onError: () => {
                  alert("error to confirmed");
                  reject();
                },
              });
            } else {
              alert("failed generate paymentId");
              reject();
            }
          } catch (error) {
            alert("failed on complete");
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

  return (
    <div className="flex flex-col gap-4">
      <div className="graduation-mysr-form"></div>
    </div>
  );
};

export default memo(GraduationAppleWidget);
