// "use client";

// import { useLocale } from "next-intl";
// import { useSelector } from "react-redux";
// import { memo, useEffect } from "react";

// import { END_POINTS } from "@constants/APIs";
// import { CONSTANT_VALUES } from "@constants/constantValues";
// import { reportError, addBreadcrumb } from "@utils/bugsnag";

// import axios from "axios";

// const AppleWidget = ({ baseData, currency = "SAR" }) => {
//   const price = useSelector(
//     (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
//   );

//   const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

//   const locale = useLocale();

//   const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
//   const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

//   useEffect(() => {
//     // Check if required data is available
//     if (!price || !tripName || !appleWidgetKey || !baseData) {
//       console.log("Missing required data for Apple Pay initialization", {
//         price: !!price,
//         tripName: !!tripName,
//         appleWidgetKey: !!appleWidgetKey,
//         baseData: !!baseData,
//       });
//       return;
//     }

//     // Check if Moyasar is available
//     if (typeof window === "undefined" || !window.Moyasar) {
//       console.error("Moyasar SDK not loaded");
//       return;
//     }

//     console.log("🔄 Initializing Apple Pay widget...");

//     Moyasar.init({
//       element: ".mysr-form",
//       amount: Math.round(price * 100), // Ensure integer
//       language: locale,
//       currency: currency,
//       description: tripName,
//       publishable_api_key: appleWidgetKey,
//       callback_url: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CALLBACK}?lang=${locale}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
//       methods: ["applepay"],
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
//             console.log("🔄 Payment initiating...");
//             addBreadcrumb("Apple Pay initiation started", { baseData });

//             // Always resolve immediately to keep widget open, make API call in background
//             resolve({});

//             // Make API call in background without blocking the widget
//             axios.post(
//               `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
//               baseData,
//               {
//                 timeout: 30000,
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//               }
//             ).then(response => {
//               if (response.data && response.data.bookingId) {
//                 console.log("✅ Apple Pay initiation successful, bookingId:", response.data.bookingId);
//                 addBreadcrumb("Apple Pay initiation successful", {
//                   bookingId: response.data.bookingId
//                 });
//                 // Store bookingId globally for later use
//                 window.applePayBookingId = response.data.bookingId;
//               } else {
//                 console.error("❌ Invalid response: missing bookingId");
//               }
//             }).catch(error => {
//               console.error("❌ Error in background API call", error);
//               reportError(error, {
//                 context: "Apple Pay initiation background",
//                 baseData,
//                 endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
//               });
//             });

//           } catch (error) {
//             console.error("❌ Error in on_initiating", error);
//             resolve({}); // Always resolve to keep widget open
//           }
//         });
//       },
//       on_completed: function (payment) {
//         return new Promise(async function (resolve, reject) {
//           try {
//             if (payment && payment.id) {
//               console.log("✅ Payment completed:", payment);
//               addBreadcrumb("Apple Pay completion started", {
//                 paymentId: payment.id,
//               });

//               // Always resolve immediately to prevent widget from closing
//               resolve({});

//               // Make confirmation API call in background
//               const confirmationData = {
//                 trip: baseData.trip,
//                 bookingId: window.applePayBookingId, // Use stored bookingId
//                 paymentId: payment.id,
//               };

//               axios.post(
//                 `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
//                 confirmationData,
//                 {
//                   timeout: 30000,
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                 }
//               ).then(response => {
//                 console.log("✅ Apple Pay confirmation successful:", response.data);
//                 addBreadcrumb("Apple Pay confirmation successful", {
//                   paymentId: payment.id,
//                   responseData: response.data,
//                 });

//                 // Redirect or handle success here if needed
//                 // window.location.href = successUrl;

//               }).catch(error => {
//                 console.error("❌ Error in confirmation API call", error);
//                 reportError(error, {
//                   context: "Apple Pay confirmation background",
//                   payment,
//                   endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
//                 });
//               });

//             } else {
//               console.error("❌ Invalid payment object:", payment);
//               resolve({}); // Still resolve to keep widget stable
//             }
//           } catch (error) {
//             console.error("❌ Error in on_completed", error);
//             resolve({}); // Always resolve to prevent widget closing
//           }
//         });
//       },
//     });
//   }, []); // Empty dependency array like your working TestApple

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
import { memo, useEffect, useCallback, useRef } from "react";

import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { reportError, addBreadcrumb } from "@utils/bugsnag";

import axios from "axios";
import { getHeaders } from "@utils/getHeaders";

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const price = useSelector(
    (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
  );

  const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

  const locale = useLocale();
  const widgetInitialized = useRef(false);
  const bookingIdRef = useRef(null);

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  // Create stable callback functions
  const handleInitiating = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("🔄 Payment initiating...");
        addBreadcrumb("Apple Pay initiation started", { baseData });

        if (!baseData) {
          console.error("❌ No baseData provided for initiation");
          reject(new Error("No baseData provided"));
          return;
        }

        // CRITICAL: Wait for the API call to complete before resolving
        try {
          const response = await axios.post(
            `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
            baseData,
            {
              timeout: 30000,
              headers: getHeaders(locale),
            }
          );

          if (response.data?.bookingId) {
            console.log(
              "✅ Apple Pay initiation successful, bookingId:",
              response.data.bookingId
            );
            addBreadcrumb("Apple Pay initiation successful", {
              bookingId: response.data.bookingId,
            });

            // Store bookingId in ref
            bookingIdRef.current = response.data.bookingId;

            // Now resolve with success - this keeps the widget open and proceeding
            resolve({
              bookingId: response.data.bookingId,
              success: true,
            });
          } else {
            console.error(
              "❌ Invalid response: missing bookingId",
              response.data
            );
            reject(new Error("Invalid response: missing bookingId"));
          }
        } catch (apiError) {
          console.error("❌ Error in initiation API call", apiError);
          reportError(apiError, {
            context: "Apple Pay initiation API",
            baseData,
            endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
          });
          reject(apiError);
        }
      } catch (error) {
        console.error("❌ Error in on_initiating", error);
        reportError(error, {
          context: "Apple Pay initiation handler",
          baseData,
        });
        reject(error);
      }
    });
  }, [baseData, locale]);

  const handleCompleted = useCallback(
    (payment) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (!payment?.id) {
            console.error("❌ Invalid payment object:", payment);
            reject(new Error("Invalid payment object"));
            return;
          }

          console.log("✅ Payment completed:", payment);
          addBreadcrumb("Apple Pay completion started", {
            paymentId: payment.id,
          });

          // Make confirmation API call and wait for it
          const confirmationData = {
            trip: baseData?.trip,
            bookingId: bookingIdRef.current,
            paymentId: payment.id,
          };

          if (!confirmationData.trip || !confirmationData.bookingId) {
            console.error(
              "❌ Missing required confirmation data:",
              confirmationData
            );
            reject(new Error("Missing required confirmation data"));
            return;
          }

          try {
            const response = await axios.post(
              `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
              confirmationData,
              {
                timeout: 30000,
                headers: getHeaders(locale),
              }
            );

            console.log("✅ Apple Pay confirmation successful:", response.data);
            addBreadcrumb("Apple Pay confirmation successful", {
              paymentId: payment.id,
              responseData: response.data,
            });

            // Resolve with success
            resolve({
              success: true,
              paymentId: payment.id,
              confirmationData: response.data,
            });

            // Handle success - redirect or update UI after a short delay
            setTimeout(() => {
              // window.location.href = successUrl;
            }, 1000);
          } catch (confirmationError) {
            console.error(
              "❌ Error in confirmation API call",
              confirmationError
            );
            reportError(confirmationError, {
              context: "Apple Pay confirmation API",
              payment,
              confirmationData,
              endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
            });
            reject(confirmationError);
          }
        } catch (error) {
          console.error("❌ Error in on_completed", error);
          reportError(error, {
            context: "Apple Pay completion handler",
            payment,
          });
          reject(error);
        }
      });
    },
    [baseData, locale]
  );

  const handleError = useCallback((error) => {
    console.error("❌ Moyasar widget error:", error);
    reportError(new Error(`Moyasar widget error: ${JSON.stringify(error)}`), {
      context: "Apple Pay widget error",
      error,
    });
  }, []);

  useEffect(() => {
    // Reset initialization flag when dependencies change
    widgetInitialized.current = false;
    bookingIdRef.current = null;
  }, [price, tripName, appleWidgetKey, baseData]);

  useEffect(() => {
    // Check if required data is available
    if (!price || !tripName || !appleWidgetKey || !baseData) {
      console.log("Missing required data for Apple Pay initialization", {
        price: !!price,
        tripName: !!tripName,
        appleWidgetKey: !!appleWidgetKey,
        baseData: !!baseData,
      });
      return;
    }

    // Check if already initialized
    if (widgetInitialized.current) {
      console.log("Widget already initialized, skipping...");
      return;
    }

    // Check if Moyasar is available
    if (typeof window === "undefined" || !window.Moyasar) {
      console.error("Moyasar SDK not loaded");
      return;
    }

    console.log("🔄 Initializing Apple Pay widget...");

    try {
      // Clear any existing widget
      const existingElement = document.querySelector(".mysr-form");
      if (existingElement) {
        existingElement.innerHTML = "";
      }

      Moyasar.init({
        element: ".mysr-form",
        amount: Math.round(price * 100), // Ensure integer
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
        on_initiating: handleInitiating,
        on_completed: handleCompleted,
        on_error: handleError,
      });

      widgetInitialized.current = true;
      console.log("✅ Apple Pay widget initialized successfully");
    } catch (error) {
      console.error("❌ Error initializing Apple Pay widget:", error);
      reportError(error, {
        context: "Apple Pay widget initialization",
        price,
        tripName,
        currency,
      });
    }

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up Apple Pay widget");
      try {
        const element = document.querySelector(".mysr-form");
        if (element) {
          element.innerHTML = "";
        }
      } catch (e) {
        console.warn("Error during cleanup:", e);
      }
      widgetInitialized.current = false;
      bookingIdRef.current = null;
    };
  }, [
    price,
    tripName,
    appleWidgetKey,
    baseData,
    currency,
    locale,
    handleInitiating,
    handleCompleted,
    handleError,
  ]);

  return (
    <div className="flex">
      <div className="mysr-form"></div>
    </div>
  );
};

export default memo(AppleWidget);
