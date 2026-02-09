"use client";

import { useEditOrderModal } from "@hooks/useEditOrderModal";
import { useLocale, useTranslations } from "next-intl";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  Stack,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import Link from "next/link";

import CustomNewTripForm from "@components/forms/customNewTrip";
import CustomizedModal from "@components/common/customizedModal";
import { backIconColored } from "@assets/svg";

import TripInfoCard from "@components/sections/pages/profile/boookings-management/orders/order-details/TripInfoCard";
import SchoolMainInfoCard from "@components/sections/pages/profile/boookings-management/orders/order-details/SchoolMainInfoCard";
import TripDateCard from "@components/sections/pages/profile/boookings-management/orders/order-details/TripDateCard";
import PricingInfoCard from "@components/sections/pages/profile/boookings-management/orders/order-details/PricingInfoCard";
import AdditionalInfoCard from "@components/sections/pages/profile/boookings-management/orders/order-details/AdditionalInfoCard";

import OrderPageLoadingSkeleton from "@components/sections/pages/profile/boookings-management/orders/order-details/OrderPageLoadingSkeleton";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import { askType } from "@constants/askType";

const OrderDetailsPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();
  const t2 = useTranslations("order_details");

  const [orderId, setOrderId] = useState(null);
  const [paramsLoading, setParamsLoading] = useState(true);

  /* =========================
     Section Refs
  ========================= */
  const schoolRef = useRef(null);
  const tripRef = useRef(null);
  const dateRef = useRef(null);
  const pricingRef = useRef(null);
  const additionalRef = useRef(null);

  const steps = useMemo(
    () => [
      {
        label: t("forms.customTrip.steps.school_info.step_title"),
        ref: schoolRef,
      },
      { label: t("forms.customTrip.steps.trip_info.step_title"), ref: tripRef },
      { label: t("forms.customTrip.steps.trip_date.step_title"), ref: dateRef },
      {
        label: t("forms.customTrip.steps.pricing.step_title"),
        ref: pricingRef,
      },
      {
        label: t("forms.customTrip.steps.additional_info.step_title"),
        ref: additionalRef,
      },
    ],
    [t]
  );

  const scrollToSection = useCallback((ref) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const {
    loadingEditDetails,
    currentEditOrderDetails,
    formSelectionData,
    error,
    isModalOpen,
    loadingFormSelection,
    openEditModal,
    closeEditModal,
    fetchOrderDetailsForView,
    refreshCurrentOrder,
    fetchFormSelectionData,
  } = useEditOrderModal(locale);

  /* =========================
     Resolve Params
  ========================= */
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams =
          params instanceof Promise ? await params : params;
        setOrderId(resolvedParams?.orderId || null);
      } catch (e) {
        console.error(e);
      } finally {
        setParamsLoading(false);
      }
    };
    resolveParams();
  }, [params]);

  /* =========================
     Fetch Data
  ========================= */
  useEffect(() => {
    if (!orderId || paramsLoading) return;
    Promise.all([
      fetchOrderDetailsForView(orderId, true, askType.CUSTOM),
      fetchFormSelectionData(),
    ]);
  }, [orderId, paramsLoading]);

  /* =========================
     Page Title
  ========================= */
  useEffect(() => {
    if (currentEditOrderDetails?.name?.[locale]) {
      document.title = `${t("pagesHead.appName")} | ${t(
        "pagesHead.title.tripDetails"
      )} - ${currentEditOrderDetails.name[locale]}`;
    }
  }, [currentEditOrderDetails, locale, t]);

  /* =========================
     Edit Handlers
  ========================= */
  const handleEditClick = useCallback(async () => {
    if (orderId && currentEditOrderDetails) {
      await openEditModal(orderId, currentEditOrderDetails);
    }
  }, [orderId, currentEditOrderDetails]);

  const handleEditSuccess = useCallback(async () => {
    closeEditModal();
    if (orderId) {
      await refreshCurrentOrder(orderId);
    }
  }, [orderId]);

  /* =========================
     Loading / Error States
  ========================= */
  if (paramsLoading) return <FullScreenLoading status />;

  if (loadingEditDetails && !currentEditOrderDetails)
    return <OrderPageLoadingSkeleton />;

  if (error && !currentEditOrderDetails)
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!currentEditOrderDetails)
    return (
      <Box p={3}>
        <Alert severity="info">{t2("orders.no_order_found")}</Alert>
      </Box>
    );

  const orderData = currentEditOrderDetails;

  /* =========================
     Render
  ========================= */
  return (
    <Box className="!font-somar py-3 mx-auto">
      {/* Header */}
      <Box className="flex gap-2 items-center mb-4">
        <Link
          href={`/${locale}/profile/bookings-management/orders`}
          className="border-2 border-mainColor w-6 h-6 flex items-center justify-center rounded-lg"
        >
          {backIconColored("var(--color-main)")}
        </Link>
        <Typography className="!text-2xl !font-somar">{t2("title")}</Typography>
      </Box>

      {/* Stepper (Static, Clickable) */}
      <Stepper
        orientation="horizontal"
        alternativeLabel={false}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="mb-4"
        sx={{
          "@media (max-width: 640px)": {
            flexDirection: "column",
            alignItems: "stretch",
            gap: "0.1rem",
          },
          "@media (min-width: 641px)": {
            flexDirection: "row",
          },
          "& .MuiStep-root": {
            "@media (max-width: 640px)": {
              padding: "0.2rem 0",
              color: "var(--color-main)",
              fontWeight: 400,
              cursor: "pointer",
            },
          },
          "& .MuiStepLabel-root": {
            "@media (max-width: 640px)": {
              flexDirection: "row",
              alignItems: "center",
              padding: "0.1rem",
              color: "var(--color-main)",
              fontWeight: 400,
              cursor: "pointer",
            },
          },
          "& .MuiStepLabel-root .Mui-completed": {
            color: "var(--color-main)",
            fontWeight: 400,
            cursor: "pointer",
          },
          "& .MuiStepLabel-root .Mui-active": {
            color: "var(--color-main)",
            fontWeight: 400,
            cursor: "pointer",
          },
          "& .MuiStepLabel-label.Mui-completed": {
            color: "var(--color-main)",
            fontWeight: 400,
          },
          "& .MuiStepLabel-label.Mui-active": {
            color: "var(--color-main)",
            fontWeight: 400,
          },
          "& .MuiStepConnector-root": {
            "@media (min-width: 641px)": {
              left: "calc(-50% + 16px)",
              right: "calc(50% + 16px)",
            },
            "@media (max-width: 640px)": {
              display: "none",
            },
            "& .MuiStepConnector-line": {
              borderColor: "#e0e0e0",
              borderTopWidth: 3,
            },
            "&.Mui-completed .MuiStepConnector-line": {
              borderColor: "var(--color-main)",
            },
            "&.Mui-active .MuiStepConnector-line": {
              borderColor: "var(--color-main)",
            },
          },
          "& .MuiStep-root:first-of-type .MuiStepConnector-root": {
            display: "none",
          },
          "& .MuiStepIcon-root": {
            fontSize: "2rem",
            "@media (min-width: 641px)": {
              fontSize: "2.5rem",
            },

            "&.Mui-completed": {
              color: "var(--color-main)",
              cursor: "pointer",
              backgroundColor: "white",
              padding: "0px",
              boxShadow: "none",
            },
            "&.Mui-active": {
              color: "var(--color-main)",

              backgroundColor: "white",
              padding: "0px",
              boxShadow: "none",
            },
            "&:not(.Mui-active):not(.Mui-completed)": {
              color: "var(--color-main)",
              cursor: "pointer",
              backgroundColor: "white",
              padding: "0px",
              boxShadow: "none",
            },
          },
          "& .MuiStepLabel-label": {
            marginInlineStart: "8px",
            color: "var(--color-main)",
            fontWeight: 400,
            fontSize: "0.875rem",
            "@media (min-width: 641px)": {
              fontSize: "1rem",
              marginInlineStart: "5px",
            },
            fontFamily: "var(--font-somar), sans-serif",
          },
        }}
      >
        {steps.map((step, index) => (
          <Step key={index} onClick={() => scrollToSection(step.ref)}>
            <StepLabel
              icon={index + 1}
              sx={{
                cursor: "pointer",
                "& .MuiStepIcon-root": {
                  color: "var(--color-main)",
                },
              }}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Sections */}
      <Stack spacing={4}>
        <div ref={schoolRef}>
          <SchoolMainInfoCard orderData={orderData} />
        </div>

        <div ref={tripRef}>
          <TripInfoCard orderData={orderData} />
        </div>

        <div ref={dateRef}>
          <TripDateCard orderData={orderData} />
        </div>

        <div ref={pricingRef}>
          <PricingInfoCard orderData={orderData} />
        </div>

        <div ref={additionalRef}>
          <AdditionalInfoCard orderData={orderData} />
        </div>
      </Stack>

      {/* Edit Button */}
      <Button
        className="!w-full !bg-mainColor !font-somar !text-white !mt-6"
        onClick={handleEditClick}
        disabled={!formSelectionData || loadingFormSelection}
        startIcon={loadingFormSelection && <CircularProgress size={20} />}
      >
        {loadingFormSelection
          ? t("common.loading")
          : t("forms.customTrip.edit")}
      </Button>

      {/* Edit Modal */}
      <CustomizedModal
        open={isModalOpen}
        handleClose={closeEditModal}
        padding={false}
        bgcolor="rgba(0, 0, 0, 0.5)"
      >
        {formSelectionData && (
          <CustomNewTripForm
            mode="edit"
            orderId={orderData._id}
            editData={orderData}
            formSelectionData={formSelectionData}
            onClose={closeEditModal}
            onSuccess={handleEditSuccess}
          />
        )}
      </CustomizedModal>
    </Box>
  );
};

export default OrderDetailsPage;
