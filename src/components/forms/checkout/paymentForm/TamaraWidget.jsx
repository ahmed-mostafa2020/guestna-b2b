"use client";

import { useLocale } from "next-intl";

import { memo, useEffect, useRef, useState } from "react";

import { CircularProgress } from "@mui/material";

const TamaraWidget = ({
  price,
  currency = "SAR",
  publicKey,
  paymentType = "installment",
}) => {
  const locale = useLocale();

  const widgetRef = useRef(null);
  const [loadingState, setLoadingState] = useState({
    scriptLoaded: false,
    initialized: false,
    error: null,
    retryCount: 0,
  });

  // Function to check if TamaraProductWidget is available
  const checkWidgetAvailability = () => {
    return typeof window !== "undefined" && window.TamaraProductWidget;
  };

  // Initialize the widget
  const initializeWidget = () => {
    // Ensure widget object exists
    if (!checkWidgetAvailability()) {
      console.error("TamaraProductWidget not available yet");
      return false;
    }

    try {
      window.TamaraProductWidget.init({
        locale,
        currency,
        publicKey,
      });

      return true;
    } catch (error) {
      console.error("Widget initialization error:", error);
      return false;
    }
  };

  // Render the widget
  const renderWidget = () => {
    if (!checkWidgetAvailability()) {
      console.error("Cannot render - TamaraProductWidget not available");
      return false;
    }

    try {
      // Make sure to update the widget with the current price before rendering
      if (widgetRef.current) {
        widgetRef.current.setAttribute("data-price", price.toString());
      }

      window.TamaraProductWidget.render();
      return true;
    } catch (error) {
      console.error("Widget render error:", error);
      return false;
    }
  };

  // Load the script with polling for widget availability
  useEffect(() => {
    // Skip if already loaded or too many retries
    if (loadingState.scriptLoaded || loadingState.retryCount >= 5) return;

    const loadScript = () => {
      // Both script URLs
      const scriptUrls = [
        "https://cdn.tamara.co/widget-v1/tamara-widget.js",
        "https://cdn.tamara.co/widget/product-widget.min.js",
      ];

      // Load both scripts in parallel
      const promises = scriptUrls.map((url) => {
        return new Promise((resolve, reject) => {
          // Skip if already loaded
          if (document.querySelector(`script[src="${url}"]`)) {
            return resolve();
          }

          const script = document.createElement("script");
          script.src = url;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      });

      // When both scripts are loaded
      Promise.all(promises)
        .then(() => {
          setLoadingState((prev) => ({ ...prev, scriptLoaded: true }));

          // Poll for widget availability
          let attempts = 0;
          const maxAttempts = 10;
          const pollInterval = 300; // ms

          const checkWidgetReady = () => {
            if (checkWidgetAvailability()) {
              // Ensure DOM is ready before initializing
              setTimeout(() => {
                const initialized = initializeWidget();
                if (initialized) {
                  setTimeout(() => {
                    renderWidget();
                    setLoadingState((prev) => ({ ...prev, initialized: true }));
                  }, 200);
                }
              }, 200);
              return;
            }

            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(checkWidgetReady, pollInterval);
            } else {
              console.error(
                "TamaraProductWidget not available after maximum polling attempts"
              );
              setLoadingState((prev) => ({
                ...prev,
                error: "Payment widget failed to initialize",
                retryCount: prev.retryCount + 1,
              }));
            }
          };

          checkWidgetReady();
        })
        .catch((error) => {
          console.error("Script loading error:", error);
          setLoadingState((prev) => ({
            ...prev,
            error: "Failed to load payment scripts",
            retryCount: prev.retryCount + 1,
          }));
        });
    };

    loadScript();
  }, [loadingState.retryCount]);

  // Re-initialize when props change
  useEffect(() => {
    if (!loadingState.scriptLoaded || !loadingState.initialized) return;

    if (checkWidgetAvailability()) {
      // Update the price attribute directly on the DOM element
      if (widgetRef.current) {
        widgetRef.current.setAttribute("data-price", price.toString());
      }

      // Re-render the widget with updated price
      renderWidget();
    }
  }, [price, loadingState.initialized, loadingState.scriptLoaded]);

  // Reset on key props change
  useEffect(() => {
    setLoadingState((prev) => ({
      ...prev,
      error: null,
      retryCount: 0,
      scriptLoaded: false,
      initialized: false,
    }));
  }, [publicKey]); // Reset completely when key changes

  // Display error with retry option
  if (loadingState.error) {
    return (
      <div className="tamara-error-container" style={{ margin: "1rem 0" }}>
        <div
          className="tamara-error-message"
          style={{ color: "#e53e3e", marginBottom: "0.5rem" }}
        >
          {loadingState.error}
        </div>
        <button
          onClick={() => {
            setLoadingState({
              scriptLoaded: false,
              initialized: false,
              error: null,
              retryCount: 0,
            });
          }}
          className="tamara-retry-button"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4299e1",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading indicator
  if (!loadingState.initialized) {
    return (
      <div
        className="tamara-loading centered"
        style={{ margin: "1rem 0", color: "#718096" }}
      >
        <CircularProgress sx={{ color: "#007473" }} />
      </div>
    );
  }

  // Render the widget container
  return (
    <div
      ref={widgetRef}
      className="tamara-product-widget-container"
      style={{ minHeight: "100px", width: "100%" }}
    >
      <div
        className="tamara-product-widget"
        data-lang={locale}
        data-price={price}
        data-currency={currency}
        data-payment-type={paymentType}
        data-disable-installment="false"
        data-disable-paylater="false"
        data-installment-minimum-amount="99"
        data-installment-maximum-amount="3000"
        data-installment-available-amount="99"
        data-pay-later-max-amount="0"
      />
    </div>
  );
};

export default memo(TamaraWidget);
