"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import axios from "axios";
import { Close } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";

import CustomizedModal from "@components/ui/customizedModal";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import BranchForm from "@components/forms/branchForm";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import { useFetchData } from "@hooks/data/useFetchData";

const BranchModal = ({
  open,
  onClose,
  branchId = null,
  onSuccess,
}) => {
  const t = useTranslations("providerProfile.branches");
  const locale = useLocale();

  const isEditMode = Boolean(branchId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingBranchInfo, setIsLoadingBranchInfo] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [branchData, setBranchData] = useState(null);

  // Fetch Cities from cities/selected/all
  const { data: citiesResponse } = useFetchData(
    B2B_END_POINTS.ADDRESS.SELECTED_CITIES,
    {},
    {
      lang: locale,
      enabled: open,
    }
  );

  const rawCities =
    citiesResponse?.data?.cities ||
    citiesResponse?.cities ||
    citiesResponse?.data ||
    (Array.isArray(citiesResponse) ? citiesResponse : []);
  const cityList = Array.isArray(rawCities)
    ? rawCities.map((c) => ({
        id: c._id || c.id,
        value: c._id || c.id,
        name:
          typeof c.name === "object" && c.name !== null
            ? c.name[locale] || c.name.ar || c.name.en || ""
            : c.name || "",
        label:
          typeof c.name === "object" && c.name !== null
            ? c.name[locale] || c.name.ar || c.name.en || ""
            : c.name || "",
      }))
    : [];

  // Fetch branch details in Edit mode
  const fetchBranchDetails = useCallback(
    async (id) => {
      if (!id) return;
      setIsLoadingBranchInfo(true);
      setSubmitError(null);

      try {
        const response = await axios.get(
          getProxyUrl(`${B2B_END_POINTS.PROVIDER_PROFILE.BRANCHES.INFO}/${id}`),
          { headers: getHeaders(locale) }
        );

        const branch = response.data?.data || response.data;
        if (branch) {
          setBranchData({
            nameAr:
              typeof branch.name === "object"
                ? branch.name?.ar || ""
                : branch.name || "",
            nameEn:
              typeof branch.name === "object" ? branch.name?.en || "" : "",
            city:
              typeof branch.city === "object" && branch.city !== null
                ? branch.city?._id || branch.city?.id || ""
                : branch.city || "",
            phone: branch.phone || "",
            email: branch.email || "",
            aboutAr:
              typeof branch.about === "object"
                ? branch.about?.ar || ""
                : typeof branch.about === "string"
                ? branch.about
                : "",
            aboutEn:
              typeof branch.about === "object" ? branch.about?.en || "" : "",
            location: {
              lat: branch.location?.lat ? String(branch.location.lat) : "24.7136",
              lng: branch.location?.lng ? String(branch.location.lng) : "46.6753",
              address: branch.location?.address || "",
            },
            isActive:
              branch.isActive !== undefined ? Boolean(branch.isActive) : true,
          });
        }
      } catch (err) {
        console.error("Failed to load branch info:", err);
        setSubmitError(t("notifications.fetchError"));
      } finally {
        setIsLoadingBranchInfo(false);
      }
    },
    [locale, t]
  );

  useEffect(() => {
    if (open) {
      if (branchId) {
        fetchBranchDetails(branchId);
      } else {
        setBranchData(null);
      }
    } else {
      setBranchData(null);
      setSubmitError(null);
      setIsLoadingBranchInfo(false);
    }
  }, [open, branchId, fetchBranchDetails]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      name: {
        ar: values.nameAr.trim(),
        en: values.nameEn.trim(),
      },
      email: values.email.trim(),
      phone: values.phone.trim(),
      city: values.city,
    };

    if (values.aboutAr?.trim() || values.aboutEn?.trim()) {
      payload.about = {
        ...(values.aboutAr?.trim() && { ar: values.aboutAr.trim() }),
        ...(values.aboutEn?.trim() && { en: values.aboutEn.trim() }),
      };
    }

    if (values.location?.lat && values.location?.lng) {
      payload.location = {
        lat: String(values.location.lat),
        lng: String(values.location.lng),
      };
    }

    try {
      const headers = getHeaders(locale);
      if (isEditMode) {
        await axios.patch(
          getProxyUrl(
            `${B2B_END_POINTS.PROVIDER_PROFILE.BRANCHES.EDIT}/${branchId}`
          ),
          payload,
          { headers }
        );
      } else {
        await axios.post(
          getProxyUrl(B2B_END_POINTS.PROVIDER_PROFILE.BRANCHES.NEW),
          payload,
          { headers }
        );
      }

      onSuccess?.(
        isEditMode
          ? t("notifications.updateSuccess")
          : t("notifications.createSuccess")
      );
      onClose?.();
    } catch (err) {
      console.error("Error saving branch:", err);
      setSubmitError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          t("notifications.actionError")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <CustomizedModal
      open={open}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      customizedCloseButton={true}
      closeButton={false}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-full p-2 sm:p-4 font-somar">
        <div className="bg-white rounded-2xl max-w-[760px] w-full mx-auto shadow-2xl border border-border overflow-hidden">
          {/* Top Pattern Header Image Component matching Figma / screenshot */}
          <FrameWithImagedHeader bodyClassName="!px-5 sm:!px-8 !pt-5 !pb-8 !gap-5">
            {/* Modal Header: Title + Subtitle + Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl sm:text-2xl font-bold text-textDark font-somar">
                  {isEditMode ? t("modal.editTitle") : t("modal.addTitle")}
                </h2>
                <p className="text-xs sm:text-sm text-textLight font-somar">
                  {isEditMode
                    ? t("modal.editSubtitle")
                    : t("modal.addSubtitle")}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer text-textLight hover:text-textDark shrink-0"
                aria-label="Close"
              >
                <Close className="!w-4 !h-4" />
              </button>
            </div>

            {/* Loading Indicator for Edit Data */}
            {isLoadingBranchInfo ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <CircularProgress size={36} sx={{ color: "var(--color-main)" }} />
                <p className="text-sm text-textLight font-somar">
                  {t("modal.loadingInfo")}
                </p>
              </div>
            ) : (
              <BranchForm
                initialValues={branchData}
                cityList={cityList}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onCancel={onClose}
              />
            )}
          </FrameWithImagedHeader>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(BranchModal);
