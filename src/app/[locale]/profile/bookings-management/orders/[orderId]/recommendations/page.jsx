"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
import axios from "axios";

import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useEditOrderModal } from "@hooks/ui/useEditOrderModal";
import CustomizedModal from "@components/ui/customizedModal";
import CustomNewTripForm from "@components/forms/customNewTrip";

import HeroBanner from "@components/features/profile/bookings-management/orders/recommendations/HeroBanner";
import RequestSummaryCard from "@components/features/profile/bookings-management/orders/recommendations/RequestSummaryCard";
import HelpCard from "@components/features/profile/bookings-management/orders/recommendations/HelpCard";
import {
  WhyCard,
  HowCard,
} from "@components/features/profile/bookings-management/orders/recommendations/InfoCards";
import TripCardAvailable from "@components/features/profile/bookings-management/orders/recommendations/TripCardAvailable";
import TripCardUnavailable from "@components/features/profile/bookings-management/orders/recommendations/TripCardUnavailable";
import RecommendationsLoadingSkeleton from "@components/features/profile/bookings-management/orders/recommendations/RecommendationsLoadingSkeleton";

const RecommendationsPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations("recommendations");

  const [orderId, setOrderId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Edit order modal ──────────────────────────────────────────────────────
  const {
    selectedEditOrderId,
    currentEditOrderDetails,
    formSelectionData,
    isDataReady,
    isModalOpen,
    openEditModal,
    closeEditModal,
  } = useEditOrderModal(locale);

  const handleEditClick = useCallback(() => {
    if (!orderId) return;
    // Pass askType so the hook selects the correct info endpoint:
    // CUSTOM → profile/askTrips/edit/custom/info
    // TRIP / CUSTOM_TRIP → profile/askTrips/edit/normal/info
    openEditModal(orderId, null, data?.askType);
  }, [orderId, data, openEditModal]);

  const handleEditSuccess = useCallback(() => {
    closeEditModal();
  }, [closeEditModal]);

  // ── Resolve params ────────────────────────────────────────────────────────
  useEffect(() => {
    const resolve = async () => {
      const resolved = params instanceof Promise ? await params : params;
      setOrderId(resolved?.orderId || null);
    };
    resolve();
  }, [params]);

  // ── Fetch recommendations ─────────────────────────────────────────────────
  const fetchRecommendations = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);
      try {
        const { data: res } = await axios.get(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.RECOMMENDATIONS}/${id}`
          ),
          { headers: getHeaders(locale) }
        );
        setData(res);
      } catch (err) {
        setError(err.response?.data?.message || t("noTrips"));
      } finally {
        setLoading(false);
      }
    },
    [locale, t]
  );

  useEffect(() => {
    if (orderId) fetchRecommendations(orderId);
  }, [orderId, fetchRecommendations]);

  const trips = data?.recommendation?.trips ?? [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="font-somar py-4">
      {loading && <RecommendationsLoadingSkeleton />}

      {!loading && error && (
        <Alert severity="error" className="!font-somar">
          {error}
        </Alert>
      )}

      {!loading && data && (
        <div className="flex flex-col gap-6">
          {/* Hero banner */}
          <HeroBanner
            data={data}
            orderId={orderId}
            locale={locale}
            onEditClick={handleEditClick}
          />

          {/* Body — sidebar (FIRST → RIGHT) + main content (LAST → LEFT) */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main content */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              {/* Info cards */}
              <div className="flex flex-col gap-4">
                <WhyCard
                  budget={data.priceRange?.min}
                  stage={data.academicStages?.map((s) => s.name).join("، ")}
                  city={data.city?.name}
                />
                {data.recommendation?.note && (
                  <HowCard note={data.recommendation.note} />
                )}
              </div>

              {/* Trips section */}
              <h2 className="text-[24px] font-bold text-[#0b7f8f] font-somar leading-7">
                {t("tripsSection")}
              </h2>

              <div className="flex flex-col gap-6">
                {trips.map((trip) =>
                  trip.available === false ? (
                    <TripCardUnavailable key={trip._id} trip={trip} />
                  ) : (
                    <TripCardAvailable
                      key={trip._id}
                      trip={trip}
                      seats={data.availableSeats}
                      locale={locale}
                      recommendationId={data._id}
                    />
                  )
                )}

                {trips.length === 0 && (
                  <Alert severity="info" className="!font-somar">
                    {t("noTrips")}
                  </Alert>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
              <RequestSummaryCard data={data} locale={locale} />
              <HelpCard />
            </aside>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      <CustomizedModal
        open={isModalOpen}
        handleClose={closeEditModal}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {selectedEditOrderId && isDataReady ? (
          <CustomNewTripForm
            mode="edit"
            orderId={currentEditOrderDetails?._id}
            editData={currentEditOrderDetails}
            formSelectionData={formSelectionData}
            onClose={closeEditModal}
            onSuccess={handleEditSuccess}
          />
        ) : selectedEditOrderId ? (
          <div className="flex items-center justify-center p-20 bg-white rounded-2xl">
            <CircularProgress size={40} />
          </div>
        ) : null}
      </CustomizedModal>
    </div>
  );
};

export default RecommendationsPage;
