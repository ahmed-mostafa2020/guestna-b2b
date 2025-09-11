// "use client";

// import { useLocale } from "next-intl";
// import { useSelector } from "react-redux";
// import { memo, useEffect, useRef } from "react";

// import { END_POINTS } from "@constants/APIs";
// import { CONSTANT_VALUES } from "@constants/constantValues";
// import { reportError, addBreadcrumb } from "@utils/bugsnag";

// import axios from "axios";

// const AppleWidget = ({ baseData, currency = "SAR" }) => {
//   const widgetRef = useRef(null);
//   const isInitializedRef = useRef(false);
//   const bookingIdRef = useRef(null); // Use ref instead of closure variable

//   const price = useSelector(
//     (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
//   );

//   const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

//   const locale = useLocale();

//   const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
//   const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

//   useEffect(() => {
//     // Prevent multiple initializations
//     if (isInitializedRef.current) {
//       console.log("Apple Pay widget already initialized, skipping...");
//       return;
//     }

//     // Check if required data is available
//     if (!price || !tripName || !appleWidgetKey || !baseData) {
//       console.log("Missing required data for Apple Pay initialization");
//       return;
//     }

//     // Check if Moyasar is available
//     if (typeof window === "undefined" || !window.Moyasar) {
//       console.error("Moyasar SDK not loaded");
//       return;
//     }

//     console.log("Initializing Apple Pay widget...");

//     try {
//       Moyasar.init({
//         element: ".mysr-form",
//         amount: price * 100,
//         language: locale,
//         currency: currency,
//         description: tripName,
//         publishable_api_key: appleWidgetKey,
//         callback_url: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CALLBACK}?lang=${locale}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
//         methods: ["applepay"],
//       apple_pay: {
//         country: "SA",
//         label: "Guestna",
//         merchant_capabilities: [
//           "supports3DS",
//           "supportsCredit",
//           "supportsDebit",
//         ],
//         supported_countries: ["SA", "US"],
//         validation_url:
//           "https://apple-pay-gateway.apple.com/paymentservices/paymentSession",
//         validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
//       },
//       on_initiating: function () {
//         return new Promise(async function (resolve, reject) {
//           try {
//             console.log("Apple Pay initiation started");
//             addBreadcrumb("Apple Pay initiation started", { baseData });

//             const response = await axios.post(
//               `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
//               baseData
//             );

//             bookingIdRef.current = response.data.bookingId;
//             console.log("Apple Pay initiation successful, bookingId:", bookingIdRef.current);
//             addBreadcrumb("Apple Pay initiation successful", { bookingId: bookingIdRef.current });

//             resolve({});
//             } catch (error) {
//               console.error("Apple Pay initiation failed:", error);
//               reportError(error, {
//                 context: "Apple Pay initiation",
//                 baseData,
//                 endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
//               });
//               reject(error);
//             }
//           });
//         },
//         on_completed: function (payment) {
//           return new Promise(async function (resolve, reject) {
//             try {
//               console.log("Apple Pay completion started", payment);
//               addBreadcrumb("Apple Pay completion started", {
//                 paymentId: payment?.id,
//               });

//               if (payment && payment.id) {
//                 const confirmationData = {
//                   trip: baseData.trip,
//                   bookingId: bookingIdRef.current,
//                   paymentId: payment.id,
//                 };

//                 const response = await axios.post(
//                   `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
//                   confirmationData
//                 );
//                 console.log("Apple Pay confirmation successful:", response);
//                 addBreadcrumb("Apple Pay confirmation successful", {
//                   paymentId: payment.id,
//                   bookingId: bookingIdRef.current,
//                 });

//                 bookingIdRef.current = null;
//                 resolve({});
//               } else {
//                 console.error("Invalid payment object:", payment);
//                 const error = new Error("Invalid payment object");
//                 reportError(error, {
//                   context: "Apple Pay completion",
//                   payment,
//                   bookingId: bookingIdRef.current,
//                 });
//                 reject(error);
//               }
//             } catch (error) {
//               console.error("Apple Pay confirmation failed:", error);
//               reportError(error, {
//                 context: "Apple Pay confirmation",
//                 payment,
//                 bookingId: bookingIdRef.current,
//                 endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
//               });
//               reject(error);
//             }
//           });
//         },
//       });

//       // Mark as initialized
//       isInitializedRef.current = true;
//       console.log("Apple Pay widget initialized successfully");
//     } catch (error) {
//       console.error("Failed to initialize Apple Pay widget:", error);
//       reportError(error, { context: "Apple Pay widget initialization" });
//     }

//     // Cleanup function
//     return () => {
//       if (window.Moyasar && window.Moyasar.destroy) {
//         console.log("Cleaning up Apple Pay widget");
//         window.Moyasar.destroy();
//       }
//       isInitializedRef.current = false;
//     };
//   }, []); // Empty dependency array to prevent re-initialization

//   return (
//     <div className="flex">
//       <div className="mysr-form"></div>
//     </div>
//   );
// };

// export default memo(AppleWidget);

"use client";

import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { memo, useEffect, useRef } from "react";

import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { reportError, addBreadcrumb } from "@utils/bugsnag";

import axios from "axios";

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const widgetRef = useRef(null);
  const isInitializedRef = useRef(false);
  const bookingIdRef = useRef(null);

  const price = useSelector(
    (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
  );

  const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

  const locale = useLocale();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      console.log("Apple Pay widget already initialized, skipping...");
      return;
    }

    // Check if required data is available
    if (!price || !tripName || !appleWidgetKey || !baseData) {
      console.log("Missing required data for Apple Pay initialization");
      return;
    }

    // Check if Moyasar is available
    if (typeof window === "undefined" || !window.Moyasar) {
      console.error("Moyasar SDK not loaded");
      return;
    }

    console.log("Initializing Apple Pay widget...");

    try {
      Moyasar.init({
        element: ".mysr-form",
        amount: price * 100,
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
          console.log("Apple Pay initiation callback triggered");

          return new Promise(async function (resolve, reject) {
            try {
              console.log("Apple Pay initiation started");
              addBreadcrumb("Apple Pay initiation started", { baseData });

              // Add a small delay to ensure the widget is fully loaded
              await new Promise((resolve) => setTimeout(resolve, 100));

              const response = await axios.post(
                `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
                baseData,
                {
                  timeout: 10000, // 10 second timeout
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.data && response.data.bookingId) {
                bookingIdRef.current = response.data.bookingId;
                console.log(
                  "Apple Pay initiation successful, bookingId:",
                  bookingIdRef.current
                );
                addBreadcrumb("Apple Pay initiation successful", {
                  bookingId: bookingIdRef.current,
                });

                // Resolve with empty object as expected by Moyasar
                resolve({});
              } else {
                throw new Error("Invalid response from initiation endpoint");
              }
            } catch (error) {
              console.error("Apple Pay initiation failed:", error);
              reportError(error, {
                context: "Apple Pay initiation",
                baseData,
                endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
                errorMessage: error.message,
                errorResponse: error.response?.data,
              });

              // Always reject with an Error object
              reject(new Error(error.message || "Apple Pay initiation failed"));
            }
          });
        },
        on_completed: function (payment) {
          console.log("Apple Pay completion callback triggered", payment);

          return new Promise(async function (resolve, reject) {
            try {
              console.log("Apple Pay completion started", payment);
              addBreadcrumb("Apple Pay completion started", {
                paymentId: payment?.id,
                bookingId: bookingIdRef.current,
              });

              // Validate payment object
              if (!payment || !payment.id) {
                throw new Error("Invalid payment object - missing payment ID");
              }

              // Validate that we have a booking ID from initiation
              if (!bookingIdRef.current) {
                throw new Error("Missing booking ID from initiation");
              }

              const confirmationData = {
                trip: baseData.trip,
                bookingId: bookingIdRef.current,
                paymentId: payment.id,
              };

              console.log("Sending confirmation data:", confirmationData);

              const response = await axios.post(
                `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
                confirmationData,
                {
                  timeout: 15000, // 15 second timeout
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              console.log("Apple Pay confirmation successful:", response.data);
              addBreadcrumb("Apple Pay confirmation successful", {
                paymentId: payment.id,
                bookingId: bookingIdRef.current,
                response: response.data,
              });

              // Clear the booking ID
              bookingIdRef.current = null;

              // Resolve with empty object
              resolve({});
            } catch (error) {
              console.error("Apple Pay confirmation failed:", error);
              reportError(error, {
                context: "Apple Pay confirmation",
                payment,
                bookingId: bookingIdRef.current,
                endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
                errorMessage: error.message,
                errorResponse: error.response?.data,
              });

              // Always reject with an Error object
              reject(
                new Error(error.message || "Apple Pay confirmation failed")
              );
            }
          });
        },
        // Add error handler
        on_error: function (error) {
          console.error("Apple Pay widget error:", error);
          reportError(new Error("Apple Pay widget error"), {
            context: "Apple Pay widget error",
            error: error,
          });
        },
      });

      // Mark as initialized
      isInitializedRef.current = true;
      console.log("Apple Pay widget initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Apple Pay widget:", error);
      reportError(error, { context: "Apple Pay widget initialization" });
    }

    // Cleanup function
    return () => {
      console.log("Cleaning up Apple Pay widget");
      if (window.Moyasar && typeof window.Moyasar.destroy === "function") {
        try {
          window.Moyasar.destroy();
        } catch (e) {
          console.warn("Error during Moyasar cleanup:", e);
        }
      }
      isInitializedRef.current = false;
      bookingIdRef.current = null;
    };
  }, []); // Keep empty dependency array

  return (
    <div className="flex">
      <div className="mysr-form"></div>
    </div>
  );
};

export default memo(AppleWidget);
