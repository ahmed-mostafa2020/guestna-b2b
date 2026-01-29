"use client";

import { useEditOrderModal } from "@hooks/useEditOrderModal";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Paper,
} from "@mui/material";
import CustomNewTripForm from "@components/forms/customNewTrip";
import CustomizedModal from "@components/common/customizedModal";
import { backIconColored } from "@/src/assets/svg";
import Link from "next/link";
import SchoolMainInfo from "@/src/components/sections/pages/profile/boookings-management/orders/order-details/SchoolMainInfo";

const OrderDetailsPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();
  const t2 = useTranslations("order_details");
  
  const orderId = params?.orderId;

  const {
    loadingEditDetails,
    currentEditOrderDetails,
    formSelectionData,
    error,
    isModalOpen,
    isDataReady,
    openEditModal,
    closeEditModal,
    fetchOrderDetailsForView,
    refreshCurrentOrder,
  } = useEditOrderModal(locale);

  // Fetch order details on mount
  useEffect(() => {
    if (orderId) {
      fetchOrderDetailsForView(orderId);
    }
  }, [orderId, fetchOrderDetailsForView]);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.tripDetails"
    )} - ${currentEditOrderDetails?.name[locale]}`;
  }, [currentEditOrderDetails, locale, t]);

  // Handle edit button click
  const handleEditClick = async () => {
    if (orderId) {
      await openEditModal(orderId);
    }
  };

  // Handle successful edit
  const handleEditSuccess = async () => {
    closeEditModal();
    if (orderId) {
      await refreshCurrentOrder(orderId);
    }
  };

  // Loading state
  if (loadingEditDetails && !currentEditOrderDetails) {
    return (
      <Box className="!font-somar">
        <Stack spacing={2}>
          <Paper
            sx={{
              height: 60,
              bgcolor: "grey.200",
              borderRadius: 2,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <Paper
            sx={{
              height: 200,
              bgcolor: "grey.200",
              borderRadius: 3,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <Paper
            sx={{
              height: 300,
              bgcolor: "grey.200",
              borderRadius: 3,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        </Stack>
      </Box>
    );
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

  return (
    <Box className="!font-somar py-3 mx-auto">
      {/* Header Section */}
      <Box className="flex gap-2  flex-col ">
        <Box className="flex gap-2 items-center flex-wrap mb-2">
          <Link
            className=" border-2 
                   border-mainColor !text-mainColor !w-8 !h-8 flex justify-center items-center !p-2 rounded-lg  "
            href={`/${locale}/profile/bookings-management/orders`}
          >
            <span className="!text-mainColor">
              {backIconColored("var(--color-main)")}
            </span>
          </Link>
          <Typography className="!text-textDark !font-somar !text-2xl ">
            {t2("title")}{" "}
          </Typography>
        </Box>
      </Box>

      <Stack spacing={3}>
        {/* School Info Section */}
        <SchoolMainInfo data={orderData} />

        {/* Trip Info Section */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontFamily: "somar", mb: 2 }}
            >
              {t("forms.customTrip.steps.trip_info.title")}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.600",
                    fontFamily: "somar",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t("forms.customTrip.steps.trip_info.fields.name.label")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontFamily: "somar" }}
                >
                  {orderData.name?.ar}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "grey.600", fontFamily: "somar" }}
                >
                  {orderData.name?.en}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.600",
                    fontFamily: "somar",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t("forms.customTrip.steps.trip_info.fields.category.label")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontFamily: "somar" }}
                >
                  {orderData.category?.name || "-"}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
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
                    "forms.customTrip.steps.trip_info.fields.supCategory.label"
                  )}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontFamily: "somar" }}
                >
                  {orderData.supCategory?.name}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.600",
                    fontFamily: "somar",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t("forms.customTrip.steps.trip_info.fields.trip_type.label")}
                </Typography>
                <Chip
                  label={orderData.tripType?.name || orderData.tripType || "-"}
                  sx={{
                    bgcolor: "var(--main-color)",
                    color: "white",
                    fontFamily: "somar",
                    fontSize: 14,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.600",
                    fontFamily: "somar",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t("forms.customTrip.steps.trip_info.fields.city.label")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontFamily: "somar" }}
                >
                  {orderData.city?.name || "-"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.600",
                    fontFamily: "somar",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t("forms.customTrip.steps.trip_info.fields.services.label")}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {(orderData.services || []).map((service, index) => (
                    <Chip
                      key={index}
                      label={service?.name || service}
                      variant="outlined"
                      sx={{
                        borderColor: "var(--main-color)",
                        color: "var(--main-color)",
                        fontFamily: "somar",
                        fontSize: 14,
                      }}
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Date & Time Section */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontFamily: "somar", mb: 2 }}
            >
              {t("forms.customTrip.steps.trip_date.title")}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.600",
                    fontFamily: "somar",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t("forms.customTrip.steps.trip_date.fields.day.label")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontFamily: "somar" }}
                >
                  {orderData.day || "-"}
                </Typography>
              </Grid>

              {orderData.endDay && (
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "grey.600",
                      fontFamily: "somar",
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    {t("forms.customTrip.steps.trip_date.fields.endDay.label")}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontFamily: "somar" }}
                  >
                    {orderData.endDay}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.600",
                    fontFamily: "somar",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t("forms.customTrip.steps.trip_date.fields.fromHour.label")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontFamily: "somar" }}
                >
                  {orderData.fromHour || "-"}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.600",
                    fontFamily: "somar",
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {t("forms.customTrip.steps.trip_date.fields.toHour.label")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, fontFamily: "somar" }}
                >
                  {orderData.toHour || "-"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontFamily: "somar", mb: 2 }}
            >
              {t("forms.customTrip.steps.pricing.title")}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "rgba(var(--main-color-rgb), 0.05)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "grey.600",
                      fontFamily: "somar",
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    {t("forms.customTrip.steps.pricing.fields.priceRange.min")}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "somar",
                      color: "var(--main-color)",
                    }}
                  >
                    {orderData.priceRange?.min || orderData.minPrice || 0}{" "}
                    <Typography
                      component="span"
                      variant="h6"
                      sx={{ fontFamily: "somar" }}
                    >
                      {t("common.currency")}
                    </Typography>
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "rgba(var(--main-color-rgb), 0.05)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "grey.600",
                      fontFamily: "somar",
                      fontWeight: 500,
                      mb: 1,
                    }}
                  >
                    {t("forms.customTrip.steps.pricing.fields.priceRange.max")}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "somar",
                      color: "var(--main-color)",
                    }}
                  >
                    {orderData.priceRange?.max || orderData.maxPrice || 0}{" "}
                    <Typography
                      component="span"
                      variant="h6"
                      sx={{ fontFamily: "somar" }}
                    >
                      {t("common.currency")}
                    </Typography>
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
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
                      "forms.customTrip.steps.pricing.fields.availableSeats.label"
                    )}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "somar",
                      color: "grey.900",
                    }}
                  >
                    {orderData.availableSeats || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

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

      {/* Edit Modal */}
      <CustomizedModal
        open={isModalOpen}
        handleClose={closeEditModal}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {orderId && isDataReady ? (
          <CustomNewTripForm
            mode="edit"
            orderId={currentEditOrderDetails._id}
            editData={currentEditOrderDetails}
            formSelectionData={formSelectionData}
            onClose={closeEditModal}
            onSuccess={handleEditSuccess}
          />
        ) : orderId ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 10,
              bgcolor: "white",
              borderRadius: 3,
            }}
          >
            <CircularProgress size={40} sx={{ color: "var(--main-color)" }} />
          </Box>
        ) : null}
      </CustomizedModal>
    </Box>
  );
};

export default OrderDetailsPage;
