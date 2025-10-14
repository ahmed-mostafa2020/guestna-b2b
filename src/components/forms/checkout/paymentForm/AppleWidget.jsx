// "use client";

// import { useLocale } from "next-intl";
// import { useSelector } from "react-redux";
// import { memo, useEffect, useState, useRef } from "react";
// import { END_POINTS } from "@constants/APIs";
// import { CONSTANT_VALUES } from "@constants/constantValues";
// import { useMutationData } from "@hooks/useMutationData";

// const AppleWidget = ({ baseData, currency = "SAR" }) => {
//   const [currentBookingId, setCurrentBookingId] = useState(null);
//   const isInitializedRef = useRef(false);
//   const widgetContainerRef = useRef(null);

//   const price = useSelector(
//     (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
//   );

//   const discountedPrice = useSelector(
//     (state) => state.finalTripDetailsData.data.discountedTotalPriceWithVat
//   );

//   const finalPrice = discountedPrice ? discountedPrice : price;

//   const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

//   const locale = useLocale();

//   const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
//   const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

//   const { mutate } = useMutationData("bookings/initiation/apple", {
//     method: "POST", // Specify POST
//   });

//   const { mutate: mutateComferm } = useMutationData(
//     "bookings/confermed/apple",
//     {
//       method: "POST", // Specify POST
//     }
//   );

//   useEffect(() => {
//     // Prevent multiple initializations
//     if (isInitializedRef.current) {
//       return;
//     }

//     // Ensure Moyasar is available
//     if (typeof window === "undefined" || !window.Moyasar) {
//       console.error("Moyasar is not available");
//       return;
//     }

//     // Mark as initialized before calling init
//     isInitializedRef.current = true;

//     try {
//       Moyasar.init({
//         element: ".mysr-form",
//         amount: +finalPrice * 100,
//         language: locale,
//         currency: currency,
//         description: tripName,
//         publishable_api_key: appleWidgetKey,
//         callback_url: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CALLBACK}?lang=${locale}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
//         methods: ["applepay"],
//         apple_pay: {
//           country: "SA",
//           label: "Guestna",
//           merchant_capabilities: [
//             "supports3DS",
//             "supportsCredit",
//             "supportsDebit",
//           ],
//           supported_countries: ["SA", "US"],
//           validation_url:
//             "https://apple-pay-gateway.apple.com/paymentservices/paymentSession",
//           validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
//         },
//         on_initiating: function () {
//           return new Promise(function (resolve, reject) {
//             try {
//               // Call the initiation endpoint
//               mutate(baseData, {
//                 onSuccess: (data) => {
//                   if (!data?.bookingId) {
//                     alert("issue at generate Id");
//                     reject();
//                   }
//                   setCurrentBookingId(data.bookingId);
//                   resolve({});
//                 },
//                 onError: (error) => {
//                   alert("on error generate Id");
//                   reject();
//                 },
//               });
//             } catch (error) {
//               alert("on error Initiation");
//               reject();
//             }
//           });
//         },
//         on_completed: function (payment) {
//           return new Promise(function (resolve, reject) {
//             try {
//               if (payment && payment.id) {
//                 // Call the confirmation endpoint
//                 const confirmationData = {
//                   trip: baseData.trip,
//                   bookingId: currentBookingId,
//                   paymentId: payment.id,
//                 };
//                 mutateComferm(confirmationData, {
//                   onSuccess: () => {
//                     setCurrentBookingId("");
//                     resolve({});
//                   },
//                   onError: (error) => {
//                     alert("error to confirmed");
//                     reject();
//                   },
//                 });
//               } else {
//                 alert("faild generate paymentId");
//                 reject();
//               }
//             } catch (error) {
//               alert("faild on complete");
//               reject();
//             }
//           });
//         },
//       });
//     } catch (error) {
//       console.error("Error initializing Moyasar:", error);
//       isInitializedRef.current = false;
//     }

//     // Cleanup function
//     return () => {
//       // Clear the widget container to prevent DOM conflicts
//       if (widgetContainerRef.current) {
//         try {
//           widgetContainerRef.current.innerHTML = "";
//         } catch (error) {
//           console.error("Error cleaning up widget:", error);
//         }
//       }
//       isInitializedRef.current = false;
//     };
//   }, []);

//   return (
//     <div className="flex" ref={widgetContainerRef}>
//       <div className="mysr-form"></div>
//     </div>
//   );
// };

// export default memo(AppleWidget);
"use client";

import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { memo, useEffect, useState, useRef } from "react";
import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { useMutationData } from "@hooks/useMutationData";

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const isInitializedRef = useRef(false);
  const widgetContainerRef = useRef(null);
  const moyasarInstanceRef = useRef(null);
  const retryTimeoutRef = useRef(null);

  const price = useSelector(
    (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
  );

  const discountedPrice = useSelector(
    (state) => state.finalTripDetailsData.data.discountedTotalPriceWithVat
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
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      return;
    }

    // Ensure Moyasar is available
    if (typeof window === "undefined" || !window.Moyasar) {
      console.error("Moyasar is not available");
      return;
    }

    const initializeMoyasar = () => {
      // Clear any existing timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      // Check if container and element exist
      const container = widgetContainerRef.current;
      if (!container || !document.contains(container)) {
        console.log("Container not ready, retrying in 100ms...");
        retryTimeoutRef.current = setTimeout(initializeMoyasar, 100);
        return;
      }

      const element = container.querySelector(".mysr-form");
      if (!element) {
        console.log("Element .mysr-form not found, retrying in 100ms...");
        retryTimeoutRef.current = setTimeout(initializeMoyasar, 100);
        return;
      }

      // Mark as initialized
      isInitializedRef.current = true;

      console.log("🚀 Initializing Moyasar...");

      try {
        const moyasarConfig = {
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
            validate_merchant_url:
              "https://api.moyasar.com/v1/applepay/initiate",
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
                    bookingId: currentBookingId,
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
        };
        // Store the Moyasar instance
        moyasarInstanceRef.current = Moyasar.init(moyasarConfig);
        console.log("✅ Moyasar initialized successfully");
      } catch (error) {
        console.error("Error initializing Moyasar:", error);
        isInitializedRef.current = false;

        // Retry on error
        retryTimeoutRef.current = setTimeout(initializeMoyasar, 500);
      }
    };

    // Start initialization with a delay to ensure DOM is ready
    retryTimeoutRef.current = setTimeout(initializeMoyasar, 200);

    // Cleanup function
    return () => {
      // Clear any pending timeouts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      // Clean up Moyasar instance
      if (moyasarInstanceRef.current) {
        try {
          // If Moyasar has a destroy method, use it
          if (typeof moyasarInstanceRef.current.destroy === "function") {
            moyasarInstanceRef.current.destroy();
          }
          moyasarInstanceRef.current = null;
        } catch (error) {
          console.error("Error destroying Moyasar instance:", error);
        }
      }

      // Safely clear the widget container
      if (widgetContainerRef.current) {
        try {
          // Remove all Moyasar-added elements safely
          const moyasarElements = widgetContainerRef.current.querySelectorAll(
            "[data-moyasar], .moyasar-form, .moyasar-element"
          );
          moyasarElements.forEach((el) => {
            try {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
            } catch (e) {
              console.warn("Could not remove Moyasar element:", e);
            }
          });

          // Clear remaining content
          widgetContainerRef.current.innerHTML = "";
        } catch (error) {
          console.error("Error cleaning up widget container:", error);
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

export default memo(AppleWidget);
