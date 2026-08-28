"use client";

import { memo, useState, useEffect, useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { Refresh, Close } from "@mui/icons-material";

import CustomizedModal from "@components/ui/customizedModal";
import ProviderOrderEditForm from "./ProviderOrderEditForm";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";

const ProviderOrderEditModal = ({
  open,
  onClose,
  orderId,
  orderData: initialOrderData,
  onSuccess,
}) => {
  const locale = useLocale();
  const t = useTranslations("providerProfile.orderDetails.editForm");
  const tGeneral = useTranslations("providerProfile.orderDetails.general");
  const headers = useMemo(() => getHeaders(locale), [locale]);

  const [fetchedOrderData, setFetchedOrderData] = useState(null);
  const [selections, setSelections] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const effectiveOrderData = fetchedOrderData || initialOrderData;

  const fetchData = useCallback(async () => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    try {
      const promises = [];

      // 1. Fetch details if not provided or incomplete
      const hasFullDetails =
        Boolean(initialOrderData) &&
        (initialOrderData.fromHour !== undefined ||
          initialOrderData.services !== undefined ||
          initialOrderData.providerBranch !== undefined);

      if (!hasFullDetails) {
        promises.push(
          axios.get(
            getProxyUrl(
              `${B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_DETAILS}/${orderId}`
            ),
            { headers }
          )
        );
      } else {
        promises.push(Promise.resolve({ data: initialOrderData }));
      }

      // 2. Fetch edit selections (services, branches)
      promises.push(
        axios.get(
          getProxyUrl(
            `${B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_EDIT_SELECTED}/${orderId}`
          ),
          { headers }
        )
      );

      const [detailsRes, selectionsRes] = await Promise.all(promises);

      const detailsData = detailsRes?.data?.data || detailsRes?.data;
      if (detailsData) {
        setFetchedOrderData(detailsData);
      }

      const selectionsData = selectionsRes?.data?.data || selectionsRes?.data;
      setSelections(selectionsData);
    } catch (err) {
      console.error("Error loading order edit data:", err);
      setError(
        err.response?.data?.message || t("loadError") || tGeneral("error")
      );
    } finally {
      setLoading(false);
    }
  }, [orderId, initialOrderData, headers, t, tGeneral]);

  useEffect(() => {
    if (open && orderId) {
      fetchData();
    } else {
      // Reset state when closing
      setFetchedOrderData(null);
      setSelections(null);
      setError(null);
      setLoading(false);
    }
  }, [open, orderId, fetchData]);

  const handleSuccess = useCallback(() => {
    onSuccess?.();
    onClose?.();
  }, [onSuccess, onClose]);

  return (
    <CustomizedModal
      open={open}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      customizedCloseButton={true}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-full p-4 font-somar">
        <div className="bg-white rounded-2xl max-w-[720px] w-full mx-auto  shadow-2xl border border-border">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-border rounded-t-2xl flex items-center justify-between">
            <h2 className="text-xl w-full text-center sm:text-2xl font-extrabold text-textDark font-somar">
              {t("pageTitle")}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer text-textLight hover:text-textDark"
              aria-label="Close"
            >
              <Close className="!w-4 !h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-7 max-h-[90vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <CircularProgress
                    size={40}
                    sx={{ color: "var(--color-main)" }}
                  />
                  <p className="text-sm font-semibold text-textLight font-somar">
                    {t("loadingSelections")}
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <p className="text-sm sm:text-base font-semibold text-red-500 font-somar">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={fetchData}
                  className="inline-flex items-center gap-2 bg-mainColor hover:bg-mainColor/90 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Refresh className="!w-4 !h-4" />
                  <span>{tGeneral("retry")}</span>
                </button>
              </div>
            ) : effectiveOrderData && selections ? (
              <ProviderOrderEditForm
                orderId={orderId}
                orderData={effectiveOrderData}
                selections={selections}
                onSuccess={handleSuccess}
                isModal={true}
                onClose={onClose}
              />
            ) : null}
          </div>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(ProviderOrderEditModal);
