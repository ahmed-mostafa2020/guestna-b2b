"use client";

import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { memo, useEffect, useState } from "react";
import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { useMutationData } from "@hooks/useMutationData";

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);

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

  const { mutate } = useMutationData("bookings/initiation/apple", {
    method: "POST", // Specify POST
  });

  const { mutate: mutateComferm } = useMutationData(
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
    <div className="flex">
      <div className="mysr-form"></div>
    </div>
  );
};

export default memo(AppleWidget);
