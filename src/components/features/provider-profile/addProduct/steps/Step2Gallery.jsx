"use client";

import { memo, useMemo, useRef } from "react";
import { useFormikContext, getIn } from "formik";
import { useTranslations } from "next-intl";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { cn } from "@utils/helpers/cn";

/**
 * Gallery Export icon matching Figma node 2078:54195
 */
const GalleryExportIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 10C10.1046 10 11 9.10457 11 8C11 6.89543 10.1046 6 9 6C7.89543 6 7 6.89543 7 8C7 9.10457 7.89543 10 9 10Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.67 18.95L7.6 15.64C8.39 15.11 9.53 15.17 10.24 15.78L10.57 16.07C11.35 16.74 12.61 16.74 13.39 16.07L17.55 12.5C18.33 11.83 19.59 11.83 20.37 12.5L22 13.9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Step2Gallery = () => {
  const t = useTranslations("providerProfile.products.newAddPage.step2");
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  const galleryInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Field errors and touched states
  const coverError = getIn(errors, "thumbnailWeb");
  const coverTouched = getIn(touched, "thumbnailWeb");
  const showCoverError = Boolean(coverError && coverTouched);

  const galleryError = getIn(errors, "gallery");
  const galleryTouched = getIn(touched, "gallery");
  const showGalleryError = Boolean(galleryError && galleryTouched);

  // Safe gallery array
  const galleryItems = useMemo(
    () => (Array.isArray(values.gallery) ? values.gallery : []),
    [values.gallery]
  );

  // Memoized URL preview for cover image
  const coverPreview = useMemo(() => {
    if (!values.thumbnailWeb) return "";
    if (typeof values.thumbnailWeb === "string") return values.thumbnailWeb;
    if (
      values.thumbnailWeb instanceof File ||
      values.thumbnailWeb instanceof Blob
    ) {
      return URL.createObjectURL(values.thumbnailWeb);
    }
    return "";
  }, [values.thumbnailWeb]);

  // Memoized URL previews for gallery items
  const galleryPreviews = useMemo(() => {
    return galleryItems.map((item) => {
      if (!item) return "";
      if (typeof item === "string") return item;
      if (item instanceof File || item instanceof Blob) {
        return URL.createObjectURL(item);
      }
      return "";
    });
  }, [galleryItems]);

  // Handle single cover image upload
  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue("thumbnailWeb", file);
      setFieldTouched("thumbnailWeb", true, false);
    }
    e.target.value = "";
  };

  // Remove cover image
  const handleRemoveCover = (e) => {
    e.stopPropagation();
    setFieldValue("thumbnailWeb", null);
    setFieldTouched("thumbnailWeb", true, false);
  };

  // Handle multiple gallery upload (min 4, max 15)
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const remainingAllowed = 15 - galleryItems.length;
      if (remainingAllowed > 0) {
        const addedFiles = files.slice(0, remainingAllowed);
        setFieldValue("gallery", [...galleryItems, ...addedFiles]);
        setFieldTouched("gallery", true, false);
      }
    }
    e.target.value = "";
  };

  // Remove single gallery item
  const handleRemoveGalleryItem = (index) => {
    const updated = galleryItems.filter((_, i) => i !== index);
    setFieldValue("gallery", updated);
    setFieldTouched("gallery", true, false);
  };

  // At least 5 slots rendered matching Figma design
  const slotsCount = Math.max(5, galleryItems.length);
  const slots = useMemo(() => {
    const list = [];
    for (let i = 0; i < slotsCount; i++) {
      list.push(galleryItems[i] || null);
    }
    return list;
  }, [galleryItems, slotsCount]);

  // Checkered pattern styling matching Figma placeholders
  const checkeredPatternStyle = {
    backgroundColor: "#f8f9fa",
    backgroundImage: `
      linear-gradient(45deg, #e9ecef 25%, transparent 25%),
      linear-gradient(-45deg, #e9ecef 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #e9ecef 75%),
      linear-gradient(-45deg, transparent 75%, #e9ecef 75%)
    `,
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
  };

  return (
    <section
      dir="rtl"
      aria-labelledby="step2-title"
      className="bg-white rounded-2xl border border-[#eaeaea] p-5 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none flex flex-col gap-8"
    >
      {/* 1. Card Header */}
      <div className="text-start">
        <h2
          id="step2-title"
          className="font-somar text-xl font-medium text-[#042a30] leading-6"
        >
          {t("cardTitle")}
        </h2>
        <p className="font-somar text-base font-medium text-[#042a30] leading-5 !mt-2">
          {t("cardSubtitle")}
        </p>
      </div>

      {/* 2. Section 1: Trip Cover Image (صورة الرحلة) */}
      <div className="flex flex-col gap-4 text-start" id="thumbnailWeb">
        <div>
          <h3 className="font-ibm text-base font-bold text-[#2b1e4c] leading-5">
            {t("tripImageTitle")} <span className="text-error">*</span>
          </h3>
          <p className="font-ibm text-sm sm:text-base font-normal text-[#2b1e4c]/85 leading-6 mt-1 whitespace-pre-line">
            {t("tripImageSubtitle")}
          </p>
        </div>

        {/* Cover Preview Container: max-w-[402px] x h-[241px] */}
        <div className="flex flex-col gap-3 max-w-[402px] w-full">
          <div
            className={cn(
              "w-full h-[241px] rounded-xl overflow-hidden relative border transition-all duration-200 group flex items-center justify-center",
              showCoverError
                ? "border-error ring-1 ring-error"
                : "border-gray-200"
            )}
            style={!coverPreview ? checkeredPatternStyle : undefined}
          >
            {coverPreview ? (
              <>
                <img
                  src={coverPreview}
                  alt={t("tripImageTitle")}
                  className="w-full h-full object-cover"
                />
                {/* Delete / Remove overlay button */}
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  title={t("removeImage")}
                >
                  <span className="bg-red-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm hover:bg-red-600 transition-colors">
                    <DeleteOutlineIcon className="w-4 h-4" />
                    {t("removeImage")}
                  </span>
                </button>
              </>
            ) : null}
          </div>

          {/* Upload Button: border-2 border-[#7a57d9] text-[#1f2626] font-bold */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="w-full h-[44px] rounded-lg border-2 border-[#7a57d9] text-[#1f2626] hover:bg-[#7a57d9]/10 font-ibm text-base font-bold flex items-center justify-center cursor-pointer transition-colors duration-200 select-none"
          >
            {coverPreview ? t("changeImageBtn") : t("uploadImageBtn")}
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />

          {showCoverError && (
            <p className="text-xs text-error font-medium">{coverError}</p>
          )}
        </div>
      </div>

      {/* 3. Section 2: Image Gallery (معرض الصور) */}
      <div className="flex flex-col gap-4 pt-2 text-start" id="gallery">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-ibm text-base font-bold text-[#2b1e4c] leading-5 flex items-center gap-1.5">
              <span>{t("gallerySectionTitle")}</span>
              <span className="text-error">*</span>
            </h3>
            <p className="font-ibm text-sm sm:text-base font-normal text-[#2b1e4c]/85 leading-6 mt-1">
              {t("gallerySectionSubtitle")}
            </p>
          </div>

          {/* Gallery Items Count Pill */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span
              className={cn(
                "text-xs font-bold px-3 py-1 rounded-full font-ibm",
                galleryItems.length >= 4
                  ? "text-[#007473] bg-[#007473]/10"
                  : "text-amber-700 bg-amber-50"
              )}
            >
              {galleryItems.length} / 15
            </span>
          </div>
        </div>

        {/* 5-Column Responsive Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {slots.map((item, index) => {
            const isUploaded = Boolean(item);
            const previewUrl = galleryPreviews[index] || "";

            return (
              <div
                key={index}
                className={cn(
                  "relative w-full aspect-[4/3] rounded-xl overflow-hidden border transition-all duration-200 flex items-center justify-center group",
                  showGalleryError && galleryItems.length < 4 && !isUploaded
                    ? "border-error/60"
                    : "border-gray-200",
                  !isUploaded && "cursor-pointer hover:border-[#007473]/50"
                )}
                style={!isUploaded ? checkeredPatternStyle : undefined}
                onClick={() => {
                  if (!isUploaded && galleryItems.length < 15) {
                    galleryInputRef.current?.click();
                  }
                }}
              >
                {isUploaded ? (
                  <>
                    <img
                      src={previewUrl}
                      alt={`Gallery item ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover delete button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGalleryItem(index);
                        }}
                        className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg transition-colors cursor-pointer shadow-sm"
                        title={t("removeImage")}
                      >
                        <DeleteOutlineIcon className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Index badge */}
                    <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      #{index + 1}
                    </span>
                  </>
                ) : (
                  <div className="text-gray-400 text-xs font-ibm flex flex-col items-center gap-1">
                    <span className="text-xl leading-none font-light text-gray-400/80">
                      +
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action bar below gallery: Error / Helper text and Upload Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          {/* Status Message */}
          <div>
            {showGalleryError ? (
              <p className="text-xs text-error font-medium">{galleryError}</p>
            ) : (
              <p className="text-xs text-subtitleColor font-ibm">
                {t("minPhotosHelp")}
              </p>
            )}
          </div>

          {/* Add Photos Button */}
          <div className="self-end sm:self-auto">
            <button
              type="button"
              disabled={galleryItems.length >= 15}
              onClick={() => galleryInputRef.current?.click()}
              className="h-12 px-6 rounded-lg bg-[#007473] hover:bg-[#005f5e] text-white font-ibm font-bold text-base leading-5 flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <GalleryExportIcon className="w-5 h-5 text-white" />
              <span>
                {galleryItems.length >= 15
                  ? t("maxPhotosReached")
                  : t("addPhotosBtn")}
              </span>
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleGalleryUpload}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Step2Gallery);
