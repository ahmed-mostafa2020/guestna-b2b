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
import { memo, useEffect, useCallback, useRef, useState } from "react";

import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { reportError, addBreadcrumb } from "@utils/bugsnag";

import axios from "axios";
import { getHeaders } from "@utils/getHeaders";

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const price = useSelector(
    (state) => state.finalTripDetailsData?.data?.basePriceTotalWithVat
  );

  const tripName = useSelector((state) => state.finalTripDetailsData?.data?.name);

  const locale = useLocale();
  const widgetInitialized = useRef(false);
  const bookingIdRef = useRef(null);
  const [debugInfo, setDebugInfo] = useState({});

  const vercelUrl = CONSTANT_VALUES?.URLS?.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  // Debug function to log all data
  const logDebugInfo = useCallback(
    (step, data = {}) => {
      const info = {
        step,
        timestamp: new Date().toISOString(),
        price: price,
        priceType: typeof price,
        priceValid: !!(price && price > 0),
        tripName: tripName,
        tripNameValid: !!(tripName && tripName.length > 0),
        baseData: baseData,
        baseDataValid: !!(baseData && typeof baseData === "object"),
        appleWidgetKey: !!appleWidgetKey,
        currency,
        locale,
        calculatedAmount: price ? Math.round(price * 100) : 0,
        ...data,
      };

      console.log(`🔍 DEBUG [${step}]:`, info);
      setDebugInfo((prev) => ({ ...prev, [step]: info }));

      return info;
    },
    [price, tripName, baseData, appleWidgetKey, currency, locale]
  );

  // Validation function
  const validateRequiredData = useCallback(() => {
    const validationResults = {
      price: {
        valid: !!(price && typeof price === "number" && price > 0),
        value: price,
        error: !price
          ? "Price is missing"
          : typeof price !== "number"
          ? "Price is not a number"
          : price <= 0
          ? "Price must be greater than 0"
          : null,
      },
      tripName: {
        valid: !!(
          tripName &&
          typeof tripName === "string" &&
          tripName.trim().length > 0
        ),
        value: tripName,
        error: !tripName
          ? "Trip name is missing"
          : typeof tripName !== "string"
          ? "Trip name is not a string"
          : tripName.trim().length === 0
          ? "Trip name is empty"
          : null,
      },
      appleWidgetKey: {
        valid: !!(
          appleWidgetKey &&
          typeof appleWidgetKey === "string" &&
          appleWidgetKey.length > 0
        ),
        value: appleWidgetKey ? `${appleWidgetKey.substring(0, 10)}...` : null,
        error: !appleWidgetKey ? "Apple widget key is missing" : null,
      },
      baseData: {
        valid: !!(baseData && typeof baseData === "object" && baseData.trip),
        value: baseData,
        error: !baseData
          ? "Base data is missing"
          : typeof baseData !== "object"
          ? "Base data is not an object"
          : !baseData.trip
          ? "Base data missing trip property"
          : null,
      },
    };

    const allValid = Object.values(validationResults).every(
      (result) => result.valid
    );

    logDebugInfo("validation", {
      validationResults,
      allValid,
      errors: Object.entries(validationResults)
        .filter(([key, result]) => !result.valid)
        .map(([key, result]) => `${key}: ${result.error}`),
    });

    return { allValid, validationResults };
  }, [price, tripName, appleWidgetKey, baseData, logDebugInfo]);

  // Create stable callback functions
  const handleInitiating = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        logDebugInfo("initiation_start");

        if (!baseData || !baseData.trip) {
          const error = new Error("No valid baseData provided for initiation");
          logDebugInfo("initiation_error", { error: error.message });
          reject(error);
          return;
        }

        logDebugInfo("initiation_api_call", {
          endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
          data: baseData,
        });

        try {
          const response = await axios.post(
            `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
            baseData,
            {
              timeout: 30000,
              headers: getHeaders(locale),
            }
          );

          logDebugInfo("initiation_api_response", {
            status: response.status,
            data: response.data,
            hasBookingId: !!response.data?.bookingId,
          });

          if (response.data?.bookingId) {
            console.log(
              "✅ Apple Pay initiation successful, bookingId:",
              response.data.bookingId
            );
            addBreadcrumb("Apple Pay initiation successful", {
              bookingId: response.data.bookingId,
            });

            bookingIdRef.current = response.data.bookingId;

            logDebugInfo("initiation_success", {
              bookingId: response.data.bookingId,
            });

            resolve({
              bookingId: response.data.bookingId,
              success: true,
            });
          } else {
            const error = new Error("Invalid response: missing bookingId");
            logDebugInfo("initiation_invalid_response", {
              error: error.message,
              response: response.data,
            });
            reject(error);
          }
        } catch (apiError) {
          logDebugInfo("initiation_api_error", {
            error: apiError.message,
            status: apiError.response?.status,
            data: apiError.response?.data,
          });

          console.error("❌ Error in initiation API call", apiError);
          reportError(apiError, {
            context: "Apple Pay initiation API",
            baseData,
            endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
          });
          reject(apiError);
        }
      } catch (error) {
        logDebugInfo("initiation_handler_error", { error: error.message });
        console.error("❌ Error in on_initiating", error);
        reportError(error, {
          context: "Apple Pay initiation handler",
          baseData,
        });
        reject(error);
      }
    });
  }, [baseData, locale, logDebugInfo]);

  const handleCompleted = useCallback(
    (payment) => {
      return new Promise(async (resolve, reject) => {
        try {
          logDebugInfo("completion_start", { payment });

          if (!payment?.id) {
            const error = new Error("Invalid payment object");
            logDebugInfo("completion_invalid_payment", {
              error: error.message,
              payment,
            });
            reject(error);
            return;
          }

          console.log("✅ Payment completed:", payment);
          addBreadcrumb("Apple Pay completion started", {
            paymentId: payment.id,
          });

          const confirmationData = {
            trip: baseData?.trip,
            bookingId: bookingIdRef.current,
            paymentId: payment.id,
          };

          logDebugInfo("completion_data", { confirmationData });

          if (!confirmationData.trip || !confirmationData.bookingId) {
            const error = new Error("Missing required confirmation data");
            logDebugInfo("completion_missing_data", {
              error: error.message,
              confirmationData,
            });
            reject(error);
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

            logDebugInfo("completion_success", {
              status: response.status,
              data: response.data,
            });

            console.log("✅ Apple Pay confirmation successful:", response.data);
            addBreadcrumb("Apple Pay confirmation successful", {
              paymentId: payment.id,
              responseData: response.data,
            });

            resolve({
              success: true,
              paymentId: payment.id,
              confirmationData: response.data,
            });

            setTimeout(() => {
              // window.location.href = successUrl;
            }, 1000);
          } catch (confirmationError) {
            logDebugInfo("completion_api_error", {
              error: confirmationError.message,
              status: confirmationError.response?.status,
              data: confirmationError.response?.data,
            });

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
          logDebugInfo("completion_handler_error", { error: error.message });
          console.error("❌ Error in on_completed", error);
          reportError(error, {
            context: "Apple Pay completion handler",
            payment,
          });
          reject(error);
        }
      });
    },
    [baseData, locale, logDebugInfo]
  );

  const handleError = useCallback(
    (error) => {
      logDebugInfo("widget_error", { error });
      console.error("❌ Moyasar widget error:", error);
      reportError(new Error(`Moyasar widget error: ${JSON.stringify(error)}`), {
        context: "Apple Pay widget error",
        error,
      });
    },
    [logDebugInfo]
  );

  // Reset initialization when dependencies change
  useEffect(() => {
    widgetInitialized.current = false;
    bookingIdRef.current = null;
    logDebugInfo("dependencies_changed");
  }, [price, tripName, appleWidgetKey, baseData]);

  useEffect(() => {
    logDebugInfo("useEffect_start");

    // Validate required data
    const { allValid, validationResults } = validateRequiredData();

    if (!allValid) {
      console.log(
        "❌ Missing or invalid required data for Apple Pay initialization",
        validationResults
      );
      return;
    }

    // Check if already initialized
    if (widgetInitialized.current) {
      logDebugInfo("already_initialized");
      return;
    }

    // Check if Moyasar is available
    if (typeof window === "undefined" || !window.Moyasar) {
      logDebugInfo("moyasar_not_available");
      console.error("Moyasar SDK not loaded");
      return;
    }

    console.log("🔄 Initializing Apple Pay widget...");
    logDebugInfo("widget_initialization_start");

    try {
      // Clear any existing widget
      const existingElement = document.querySelector(".mysr-form");
      if (existingElement) {
        existingElement.innerHTML = "";
        logDebugInfo("cleared_existing_widget");
      }

      const calculatedAmount = Math.round(price * 100);

      const moyasarConfig = {
        element: ".mysr-form",
        amount: calculatedAmount,
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
      };

      logDebugInfo("moyasar_config", { config: moyasarConfig });

      Moyasar.init(moyasarConfig);

      widgetInitialized.current = true;
      logDebugInfo("widget_initialized_success");
      console.log("✅ Apple Pay widget initialized successfully");
    } catch (error) {
      logDebugInfo("widget_initialization_error", { error: error.message });
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
      logDebugInfo("cleanup_start");
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
    validateRequiredData,
    logDebugInfo,
  ]);

  return (
    <div className="flex flex-col">
      <div className="mysr-form"></div>
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-gray-100 text-xs">
          <h4>Debug Info:</h4>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default memo(AppleWidget);
