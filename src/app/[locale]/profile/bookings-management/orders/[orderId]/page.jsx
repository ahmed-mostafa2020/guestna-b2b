"use client";

import { useEditOrderModal } from "@hooks/useEditOrderModal";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Alert,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import CustomNewTripForm from "@components/forms/customNewTrip";
import CustomizedModal from "@components/common/customizedModal";
import { backIconColored } from "@assets/svg";
import Link from "next/link";
import TripInfoCard from "@components/sections/pages/profile/boookings-management/orders/order-details/TripInfoCard";
import SchoolMainInfoCard from "@components/sections/pages/profile/boookings-management/orders/order-details/SchoolMainInfoCard";
import TripDateCard from "@components/sections/pages/profile/boookings-management/orders/order-details/TripDateCard";
import PricingInfoCard from "@components/sections/pages/profile/boookings-management/orders/order-details/PricingInfoCard";
import OrderPageLoadingSkeleton from "@components/sections/pages/profile/boookings-management/orders/order-details/OrderPageLoadingSkeleton";
import FullScreenLoading from "@/src/feedback/loading/FullScreenLoading";

const OrderDetailsPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();
  const t2 = useTranslations("order_details");

  // State to store the resolved orderId
  const [orderId, setOrderId] = useState(null);
  const [paramsLoading, setParamsLoading] = useState(true);

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

  // Resolve params (Next.js App Router async params)
  useEffect(() => {
    const resolveParams = async () => {
      try {
        setParamsLoading(true);
        const resolvedParams =
          params instanceof Promise ? await params : params;
        const id = resolvedParams?.orderId;

        if (id) {
          setOrderId(id);
        } else {
          console.error("No orderId found in params");
        }
      } catch (error) {
        console.error("Error resolving params:", error);
      } finally {
        setParamsLoading(false);
      }
    };

    resolveParams();
  }, [params]);

  // Fetch order details AND form selection data on mount
  useEffect(() => {
    if (orderId && !paramsLoading) {
      // Fetch both order details and form selection data immediately
      const loadData = async () => {
        await Promise.all([
          fetchOrderDetailsForView(orderId),
          fetchFormSelectionData(), // Pre-load form selection data
        ]);
      };
      loadData();
    }
  }, [
    orderId,
    paramsLoading,
    fetchOrderDetailsForView,
    fetchFormSelectionData,
  ]);

  // Update document title
  useEffect(() => {
    if (currentEditOrderDetails?.name?.[locale]) {
      document.title = `${t("pagesHead.appName")} | ${t(
        "pagesHead.title.tripDetails"
      )} - ${currentEditOrderDetails.name[locale]}`;
    }
  }, [currentEditOrderDetails, locale, t]);

  // Handle edit button click - pass existing data to avoid refetching
  const handleEditClick = async () => {
    if (orderId && currentEditOrderDetails) {
      console.log("Opening modal with existing data:", {
        orderId,
        hasOrderData: !!currentEditOrderDetails,
        hasFormData: !!formSelectionData,
      });

      // Pass the existing order data to the modal
      await openEditModal(orderId, currentEditOrderDetails);
    }
  };

  // Handle successful edit
  const handleEditSuccess = async () => {
    closeEditModal();
    if (orderId) {
      await refreshCurrentOrder(orderId);
    }
  };

  // Loading state for params resolution
  if (paramsLoading) {
    return (
     <FullScreenLoading status={paramsLoading}/>
    );
  }



  // Loading state for order details
  if (loadingEditDetails && !currentEditOrderDetails) {
    return <OrderPageLoadingSkeleton />;
  }

  // Error state
  if (error && !currentEditOrderDetails) {
    return (
      <Box sx={{ p: 3, fontFamily: "somar" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // No data state
  if (!currentEditOrderDetails) {
    return (
      <Box sx={{ p: 3, fontFamily: "somar" }}>
        <Alert severity="info">{t2("orders.no_order_found")}</Alert>
      </Box>
    );
  }

  const orderData = currentEditOrderDetails;

  // Check if all data is ready for the modal
  const isFormDataReady = currentEditOrderDetails && formSelectionData;

  return (
    <Box className="!font-somar py-3 mx-auto">
      {/* Header Section */}
      <Box className="flex gap-2 flex-col">
        <Box className="flex gap-2 items-center flex-wrap mb-4">
          <Link
            className="border-2 border-mainColor !text-mainColor !w-8 !h-8 flex justify-center items-center !p-2 rounded-lg"
            href={`/${locale}/profile/bookings-management/orders`}
          >
            <span className="!text-mainColor">
              {backIconColored("var(--color-main)")}
            </span>
          </Link>
          <Typography className="!text-textDark !font-somar !text-2xl">
            {t2("title")}
          </Typography>
        </Box>
      </Box>

      <Stack spacing={3}>
        {/* School Info Section */}
        <SchoolMainInfoCard orderData={orderData} />

        {/* Trip Info Section */}
        <TripInfoCard orderData={orderData} />

        {/* Trip Date Section */}
        <TripDateCard orderData={orderData} />

        {/* Pricing Section */}
        <PricingInfoCard orderData={orderData} />

        {/* Additional Info Section */}
        {(orderData.specialRequirements ||
          orderData.note ||
          orderData.file) && (
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, fontFamily: "somar", mb: 2 }}
              >
                {t("forms.customTrip.steps.additional_info.title")}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                {orderData.specialRequirements && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "grey.600",
                        fontFamily: "somar",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {t(
                        "forms.customTrip.steps.additional_info.fields.specialRequirements.label"
                      )}
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                      <Typography sx={{ fontFamily: "somar" }}>
                        {orderData.specialRequirements}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {orderData.note && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "grey.600",
                        fontFamily: "somar",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {t(
                        "forms.customTrip.steps.additional_info.fields.note.label"
                      )}
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                      <Typography sx={{ fontFamily: "somar" }}>
                        {orderData.note}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {orderData.file && (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "grey.600",
                        fontFamily: "somar",
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {t(
                        "forms.customTrip.steps.additional_info.fields.file.label"
                      )}
                    </Typography>
                    <Button
                      variant="outlined"
                      href={orderData.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        borderColor: "var(--main-color)",
                        color: "var(--main-color)",
                        fontFamily: "somar",
                        textTransform: "none",
                        fontSize: 16,
                        "&:hover": {
                          borderColor: "var(--main-color)",
                          bgcolor: "var(--main-color)",
                          color: "white",
                        },
                      }}
                    >
                      {t("common.view_file")}
                    </Button>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* Edit Button */}
      <Button
        className="!w-full !bg-mainColor !font-somar !text-white hover:bg-linksHover !mt-4"
        onClick={handleEditClick}
        disabled={!isFormDataReady || loadingFormSelection}
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
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {/* Show loading state while waiting for form selection data */}
        {isModalOpen && (!orderData || !formSelectionData) ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 400,
              bgcolor: "white",
              borderRadius: 2,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <CircularProgress />
              <Typography sx={{ fontFamily: "somar" }}>
                {t("common.loading")}
              </Typography>
            </Stack>
          </Box>
        ) : (
          isModalOpen &&
          orderData &&
          formSelectionData && (
            <CustomNewTripForm
              mode="edit"
              orderId={orderData._id}
              editData={orderData}
              formSelectionData={formSelectionData}
              onClose={closeEditModal}
              onSuccess={handleEditSuccess}
            />
          )
        )}
      </CustomizedModal>
    </Box>
  );
};

export default OrderDetailsPage;
