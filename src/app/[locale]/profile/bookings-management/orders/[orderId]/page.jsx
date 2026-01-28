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
  Dialog,
  Skeleton,
} from "@mui/material";
import {
  Edit as EditIcon,
  CalendarToday,
  School,
  LocationOn,
  Category,
  AttachMoney,
} from "@mui/icons-material";
import  CustomNewTripForm from "@components/forms/customNewTrip"; 
import CustomizedModal from "@components/common/customizedModal";


const OrderDetailsPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const params = useParams();
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

  // Handle edit button click
  const handleEditClick = async () => {
    if (orderId) {
      await openEditModal(orderId);
    }
  };

  // Handle successful edit
  const handleEditSuccess = async () => {
    closeEditModal();
    // Refresh the order details
    if (orderId) {
      await refreshCurrentOrder(orderId);
    }
  };

  // Loading state
  if (loadingEditDetails && !currentEditOrderDetails) {
    return (
      <Box className="p-6">
        <Skeleton variant="rectangular" height={200} className="mb-4" />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  // Error state
  if (error && !currentEditOrderDetails) {
    return (
      <Box className="p-6">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // No data state
  if (!currentEditOrderDetails) {
    return (
      <Box className="p-6">
        <Alert severity="info">{t("orders.no_order_found")}</Alert>
      </Box>
    );
  }

  const orderData = currentEditOrderDetails;

  return (
    <Box className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <Box className="flex justify-between items-center mb-6">
        <Typography  className="font-bold text-textDark">
          {t("orders.order_details")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditClick}
          className="bg-mainColor hover:bg-titleColor"
        >
          {t("common.edit")}
        </Button>
      </Box>

      {/* School Info Section */}
      <Card className="mb-6 !rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <School className="text-mainColor text-2xl" />
            <Typography variant="h6" className="font-bold text-textDark">
              {t("forms.customTrip.steps.school_info.title")}
            </Typography>
          </Box>
          <Divider className="mb-4" />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography  className="text-textLight mb-1">
                {t(
                  "forms.customTrip.steps.school_info.fields.organization.label"
                )}
              </Typography>
              <Typography  className="font-medium">
                {orderData.organization?.name 
                  
                }
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.school_info.fields.track.label")}
              </Typography>
              <Typography  className="font-medium">
                {orderData.track?.name }
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography  className="text-textLight mb-1">
                {t(
                  "forms.customTrip.steps.school_info.fields.academicStages.label"
                )}
              </Typography>
              <Box className="flex gap-2 flex-wrap">
                {(
                  orderData.academicStages 
                ).map((stage, index) => (
                  <Chip
                    key={index}
                    label={stage?.name || stage}
                    className="bg-homeBg text-mainColor"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Trip Info Section */}
      <Card className="mb-6 !rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <Category className="text-mainColor text-2xl" />
            <Typography variant="h6" className="font-bold text-textDark">
              {t("forms.customTrip.steps.trip_info.title")}
            </Typography>
          </Box>
          <Divider className="mb-4" />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.trip_info.fields.name.label")}
              </Typography>
              <Typography  className="font-medium">
                {orderData.name?.ar || orderData.name?.en || "-"}
              </Typography>
              <Typography  className="text-textLight">
                {orderData.name?.en && `(${orderData.name.en})`}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.trip_info.fields.category.label")}
              </Typography>
              <Typography  className="font-medium">
                {orderData.category?.name || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.trip_info.fields.supCategory.label")}
              </Typography>
              <Typography  className="font-medium">
                {orderData.supCategory?.name || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.trip_info.fields.trip_type.label")}
              </Typography>
              <Chip
                label={orderData.tripType?.name || orderData.tripType || "-"}
                className="bg-mainColor text-white"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography  className="text-textLight mb-1">
                <LocationOn className="inline text-base mr-1" />
                {t("forms.customTrip.steps.trip_info.fields.city.label")}
              </Typography>
              <Typography  className="font-medium">
                {orderData.city?.name || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.trip_info.fields.services.label")}
              </Typography>
              <Box className="flex gap-2 flex-wrap">
                {(orderData.services || []).map((service, index) => (
                  <Chip
                    key={index}
                    label={service?.name || service}
                    variant="outlined"
                    className="border-mainColor text-mainColor"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Date & Time Section */}
      <Card className="mb-6 !rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <CalendarToday className="text-mainColor text-2xl" />
            <Typography variant="h6" className="font-bold text-textDark">
              {t("forms.customTrip.steps.trip_date.title")}
            </Typography>
          </Box>
          <Divider className="mb-4" />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.trip_date.fields.day.label")}
              </Typography>
              <Typography  className="font-medium">
                {orderData.day || "-"}
              </Typography>
            </Grid>

            {orderData.endDay && (
              <Grid item xs={12} md={6}>
                <Typography  className="text-textLight mb-1">
                  {t("forms.customTrip.steps.trip_date.fields.endDay.label")}
                </Typography>
                <Typography  className="font-medium">
                  {orderData.endDay}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.trip_date.fields.fromHour.label")}
              </Typography>
              <Typography  className="font-medium">
                {orderData.fromHour || "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.trip_date.fields.toHour.label")}
              </Typography>
              <Typography  className="font-medium">
                {orderData.toHour || "-"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card className="mb-6 !rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <AttachMoney className="text-mainColor text-2xl" />
            <Typography variant="h6" className="font-bold text-textDark">
              {t("forms.customTrip.steps.pricing.title")}
            </Typography>
          </Box>
          <Divider className="mb-4" />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.pricing.fields.priceRange.min")}
              </Typography>
              <Typography variant="h6" className="font-bold text-mainColor">
                {orderData.priceRange?.min || orderData.minPrice || 0}{" "}
                {t("common.currency")}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography  className="text-textLight mb-1">
                {t("forms.customTrip.steps.pricing.fields.priceRange.max")}
              </Typography>
              <Typography variant="h6" className="font-bold text-mainColor">
                {orderData.priceRange?.max || orderData.maxPrice || 0}{" "}
                {t("common.currency")}
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography  className="text-textLight mb-1">
                {t(
                  "forms.customTrip.steps.pricing.fields.availableSeats.label"
                )}
              </Typography>
              <Typography variant="h6" className="font-bold text-textDark">
                {orderData.availableSeats || 0}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Additional Info Section */}
      {(orderData.specialRequirements || orderData.note || orderData.file) && (
        <Card className="!rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <Typography variant="h6" className="font-bold text-textDark mb-4">
              {t("forms.customTrip.steps.additional_info.title")}
            </Typography>
            <Divider className="mb-4" />

            <Grid container spacing={3}>
              {orderData.specialRequirements && (
                <Grid item xs={12}>
                  <Typography
                    
                    className="text-textLight mb-1"
                  >
                    {t(
                      "forms.customTrip.steps.additional_info.fields.specialRequirements.label"
                    )}
                  </Typography>
                  <Typography >
                    {orderData.specialRequirements}
                  </Typography>
                </Grid>
              )}

              {orderData.note && (
                <Grid item xs={12}>
                  <Typography
                    
                    className="text-textLight mb-1"
                  >
                    {t(
                      "forms.customTrip.steps.additional_info.fields.note.label"
                    )}
                  </Typography>
                  <Typography >{orderData.note}</Typography>
                </Grid>
              )}

              {orderData.file && (
                <Grid item xs={12}>
                  <Typography
                    
                    className="text-textLight mb-1"
                  >
                    {t(
                      "forms.customTrip.steps.additional_info.fields.file.label"
                    )}
                  </Typography>
                  <Button
                    variant="outlined"
                    href={orderData.file}
                    target="_blank"
                    className="border-mainColor text-mainColor"
                  >
                    {t("common.view_file")}
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

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
                  orderId={orderId}
                  editData={currentEditOrderDetails}
                  formSelectionData={formSelectionData}
                  onClose={closeEditModal}
                  onSuccess={handleEditSuccess}
                />
              ) : orderId ? (
                <div className="flex items-center justify-center p-20 bg-white rounded-2xl">
                  <CircularProgress size={40} />
                </div>
              ) : null}
            </CustomizedModal>
    </Box>
  );
};

export default OrderDetailsPage;
