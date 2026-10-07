"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { useMutationData } from "@hooks/data/useMutationData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

// If Apple Pay neither completes nor fails within this time (sheet never
// opened, user dismissed it, Safari dropped the session...), stop waiting.
const PAYMENT_WATCHDOG_MS = 60 * 1000;
// Moyasar redirects to callback_url after on_completed; fall back if it doesn't.
const REDIRECT_FALLBACK_MS = 4 * 1000;

const MESSAGES = {
  ar: {
    notCompleted: "لم تكتمل عملية الدفع، يمكنك المحاولة مرة أخرى",
    failed: "فشلت عملية الدفع، يمكنك المحاولة مرة أخرى",
  },
  en: {
    notCompleted: "The payment was not completed, you can try again",
    failed: "The payment failed, you can try again",
  },
};

const extractBackendError = (error, fallback) => {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (Array.isArray(data.info) && data.info.length > 0) {
    return data.info
      .map((i) => i.message)
      .filter(Boolean)
      .join(" | ");
  }
  return data.message || fallback;
};

const isTestEnvironment = () => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host !== "guestna-edu.com" && host !== "www.guestna-edu.com";
};

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const showDebugInitiate = useMemo(() => isTestEnvironment(), []);

  const bookingIdRef = useRef(null);
  const isInitializedRef = useRef(false);
  const isPaymentActiveRef = useRef(false);
  const isMountedRef = useRef(true);
  const watchdogRef = useRef(null);
  const redirectFallbackRef = useRef(null);
  const formRef = useRef(null);
  const baseDataRef = useRef(baseData);
  const [isProcessing, setIsProcessing] = useState(false);

  const finalTripDetails = useSelector(
    (state) => state.finalTripDetailsData.data
  );
  const promoCodeData = useSelector(
    (state) => state.promoCode?.promoCodeData?.trip
  );

  const data = promoCodeData || finalTripDetails;

  const finalPrice = data?.calculatedPriceInfo?.total ?? 0;
  // Moyasar needs an integer amount in halalas, and the backend rejects any
  // difference from the booking price (250.1 * 100 = 25009.999...).
  const amountInHalalas = Math.round(+finalPrice * 100);

  const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

  const locale = useLocale();
  const messages = MESSAGES[locale] || MESSAGES.ar;

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  const { mutate, isLoading: isInitiating } = useMutationData(
    B2B_END_POINTS.APPLE_BOOKING.INITIATE,
    { method: "POST" }
  );

  const { mutate: mutateComferm } = useMutationData(
    B2B_END_POINTS.APPLE_BOOKING.CONFIRM,
    { method: "POST" }
  );

  // Keep latest baseData accessible inside Moyasar callbacks without re-init
  useEffect(() => {
    baseDataRef.current = baseData;
  }, [baseData]);

  const clearTimers = () => {
    clearTimeout(watchdogRef.current);
    clearTimeout(redirectFallbackRef.current);
    watchdogRef.current = null;
    redirectFallbackRef.current = null;
  };

  // Single exit for every path that ends without a redirect: hides the
  // spinner and lets the user tap Apple Pay again.
  const resetPayment = () => {
    clearTimers();
    isPaymentActiveRef.current = false;
    if (isMountedRef.current) setIsProcessing(false);
  };

  const goToBookingStatus = (bookingId) => {
    const targetUrl = `/${locale}/bookingStatus/${bookingId}`;
    try {
      router.push(targetUrl);
    } catch {
      window.location.href = targetUrl;
    }
  };

  // Asks the backend whether the booking got paid anyway (e.g. the webhook
  // confirmed it while the browser hung).
  const isBookingPaid = async (bookingId) => {
    try {
      const { data: res } = await axios.get(
        `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.CHECK_BOOKING}/${bookingId}`,
        { headers: { lang: locale } }
      );
      return !!res?.isBooking;
    } catch {
      return false;
    }
  };

  const onWatchdogTimeout = async () => {
    const bookingId = bookingIdRef.current;
    if (bookingId && (await isBookingPaid(bookingId))) {
      clearTimers();
      goToBookingStatus(bookingId);
      return;
    }
    resetPayment();
    enqueueSnackbar(messages.notCompleted, { variant: "warning" });
  };

  const startWatchdog = () => {
    clearTimeout(watchdogRef.current);
    watchdogRef.current = setTimeout(onWatchdogTimeout, PAYMENT_WATCHDOG_MS);
  };

  const handleDebugInitiate = () => {
    try {
      mutate(
        {
          ...baseDataRef.current,
          price: +finalPrice,
          sessionKey: baseDataRef.current.client,
        },
        {
          onSuccess: (data) => {
            if (!data?.bookingId) {
              enqueueSnackbar("issue at generate Id", { variant: "error" });
              return;
            }
            bookingIdRef.current = data.bookingId;
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
        }
      );
    } catch (error) {
      enqueueSnackbar("on error Initiation", { variant: "error" });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (isInitializedRef.current) return;
    if (typeof window === "undefined" || !window.Moyasar) return;

    isInitializedRef.current = true;
    const sessionKey = baseData.client;

    try {
      Moyasar.init({
        element: ".mysr-form",
        amount: amountInHalalas,
        language: locale,
        currency: currency,
        description: tripName,
        publishable_api_key: appleWidgetKey,
        callback_url: `${B2B_END_POINTS.PAYMENTS}${B2B_END_POINTS.APPLE_BOOKING.CALLBACK}?lang=${locale}&sessionKey=${sessionKey}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
        metadata: {
          sessionKey,
        },
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
          // Guard against double-tap — prevents "active payment session" error
          if (isPaymentActiveRef.current) {
            return Promise.reject(new Error("Payment already in progress"));
          }
          isPaymentActiveRef.current = true;
          setIsProcessing(true);
          return new Promise(function (resolve, reject) {
            const fail = (message) => {
              enqueueSnackbar(message, { variant: "error" });
              resetPayment();
              reject();
            };
            try {
              mutate(
                {
                  ...baseDataRef.current,
                  price: +finalPrice,
                  sessionKey,
                },
                {
                  onSuccess: (data) => {
                    if (!data?.bookingId) {
                      fail("issue at generate Id");
                      return;
                    }
                    bookingIdRef.current = data.bookingId;
                    // From here on Apple Pay may hang without any callback.
                    startWatchdog();
                    resolve({});
                  },
                  onError: (error) => {
                    fail(extractBackendError(error, "on error generate Id"));
                  },
                }
              );
            } catch (error) {
              fail("on error Initiation");
            }
          });
        },
        on_failure: function (error) {
          // Apple Pay / Moyasar failed before a payment was created.
          console.error("Apple Pay failed:", error);
          resetPayment();
          enqueueSnackbar(messages.failed, { variant: "error" });
        },
        on_completed: function (payment) {
          // A payment exists now — the watchdog must not reset the UI while
          // we confirm it.
          clearTimeout(watchdogRef.current);

          const handleFailedRedirect = () => {
            const currentBookingId = bookingIdRef.current;
            if (currentBookingId) {
              setTimeout(() => goToBookingStatus(currentBookingId), 500);
            }
          };

          return new Promise(function (resolve, reject) {
            const fail = (message) => {
              enqueueSnackbar(message, { variant: "error" });
              resetPayment();
              reject();
              handleFailedRedirect();
            };
            try {
              if (payment && payment.id) {
                const confirmationData = {
                  trip: baseDataRef.current?.trip,
                  bookingId: bookingIdRef.current,
                  paymentId: payment.id,
                  sessionKey,
                };
                mutateComferm(confirmationData, {
                  onSuccess: () => {
                    const confirmedBookingId = bookingIdRef.current;
                    isPaymentActiveRef.current = false;
                    // Moyasar should redirect to callback_url now; if it
                    // doesn't, open the booking status page ourselves.
                    redirectFallbackRef.current = setTimeout(() => {
                      if (isMountedRef.current && confirmedBookingId) {
                        goToBookingStatus(confirmedBookingId);
                      }
                    }, REDIRECT_FALLBACK_MS);
                    resolve({});
                  },
                  onError: (error) => {
                    fail(extractBackendError(error, "error to confirmed"));
                  },
                });
              } else {
                fail("faild generate paymentId");
              }
            } catch (error) {
              fail("faild on complete");
            }
          });
        },
      });
    } catch (error) {
      console.error("Error initializing Moyasar:", error);
      isInitializedRef.current = false;
    }

    const formElement = formRef.current;
    return () => {
      isMountedRef.current = false;
      clearTimers();
      isPaymentActiveRef.current = false;
      // Clear only Moyasar's injected markup — the .mysr-form node itself is
      // owned by React and must stay for a re-init.
      if (formElement) {
        try {
          formElement.innerHTML = "";
        } catch (error) {
          console.error("Error cleaning up widget:", error);
        }
      }
      isInitializedRef.current = false;
    };
    // Re-init when the client changes: metadata.sessionKey / callback_url must
    // match the booking's sessionKey or the backend rejects the payment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseData.client]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div className="mysr-form" ref={formRef}></div>
        {isProcessing && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl cursor-not-allowed"
            style={{ pointerEvents: "all" }}
            aria-busy="true"
          >
            <CircularProgress size={32} sx={{ color: "#ED8A22" }} />
          </div>
        )}
      </div>
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
