"use client";

import { memo, useMemo, useRef, useState, useEffect } from "react";
import { useFormikContext, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { cn } from "@utils/helpers/cn";
import { compressVideo } from "@utils/helpers/compressVideo";
import { compressImage } from "@utils/helpers/compressImage";

/**
 * YouTube SVG Icon
 */
const YouTubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

/**
 * Extracts 11-char YouTube video ID from various YouTube URL formats
 */
const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2]?.length === 11 ? match[2] : null;
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
};

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
  const locale = useLocale();
  const isAr = locale === "ar";

  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  const galleryInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Field errors and touched states (supporting backend names thumbnail and gallary)
  const coverError = getIn(errors, "thumbnail") || getIn(errors, "thumbnailWeb");
  const coverTouched = getIn(touched, "thumbnail") || getIn(touched, "thumbnailWeb");
  const showCoverError = Boolean(coverError && coverTouched);

  const galleryError = getIn(errors, "gallary") || getIn(errors, "gallery");
  const galleryTouched = getIn(touched, "gallary") || getIn(touched, "gallery");
  const showGalleryError = Boolean(galleryError && galleryTouched);

  const [videoFileError, setVideoFileError] = useState("");
  const [isCompressingVideo, setIsCompressingVideo] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const videoError = getIn(errors, "video") || videoFileError;
  const videoTouched = getIn(touched, "video");
  const showVideoError = Boolean(videoError && (videoTouched || videoFileError));

  const youtubeError = getIn(errors, "youtubeUrl");
  const youtubeTouched = getIn(touched, "youtubeUrl");
  const showYoutubeError = Boolean(youtubeError && youtubeTouched);

  const hasVideoFile = Boolean(values.video);
  const hasYoutubeUrl = Boolean(
    values.youtubeUrl && String(values.youtubeUrl).trim().length > 0
  );

  // Extract YouTube video ID for embedded player preview
  const youtubeVideoId = useMemo(
    () => getYouTubeVideoId(values.youtubeUrl),
    [values.youtubeUrl]
  );

  // Safe gallery array (supports gallary and gallery)
  const galleryItems = useMemo(() => {
    if (Array.isArray(values.gallary) && values.gallary.length > 0) {
      return values.gallary;
    }
    if (Array.isArray(values.gallery) && values.gallery.length > 0) {
      return values.gallery;
    }
    return [];
  }, [values.gallary, values.gallery]);

  // Image compression state
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [videoPreview, setVideoPreview] = useState("");
  const [videoMetadata, setVideoMetadata] = useState({ name: "", size: 0 });

  useEffect(() => {
    let createdUrl = "";
    if (values.video instanceof File || values.video instanceof Blob) {
      createdUrl = URL.createObjectURL(values.video);
      setVideoPreview(createdUrl);
      setVideoMetadata({
        name: values.video.name || "video.mp4",
        size: values.video.size || 0,
      });
    } else if (typeof values.video === "string" && values.video) {
      setVideoPreview(values.video);
      setVideoMetadata({ name: values.video.split("/").pop() || "video", size: 0 });
    } else {
      setVideoPreview("");
      setVideoMetadata({ name: "", size: 0 });
    }

    return () => {
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [values.video]);

  // Handle single video upload (max 20MB, auto-compress if 12MB-40MB, mp4/webm/mov/ogg)
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const absoluteLimit = 40 * 1024 * 1024;
    if (file.size > absoluteLimit) {
      setVideoFileError(
        t("videoSizeLimit") || "Video size must not exceed 20MB (please use YouTube link for larger videos)"
      );
      e.target.value = "";
      return;
    }

    const allowedMimePrefix = "video/";
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith(allowedMimePrefix)) {
      setVideoFileError(
        t("videoFormatError") || "Unsupported video format"
      );
      e.target.value = "";
      return;
    }

    let processedFile = file;

    // Auto-compress if file is between 12MB and 40MB
    if (file.size > 12 * 1024 * 1024) {
      setIsCompressingVideo(true);
      setCompressionProgress(0);
      try {
        processedFile = await compressVideo(file, {
          maxDimension: 720,
          targetBitrate: 1000000,
          onProgress: (pct) => setCompressionProgress(pct),
        });
      } catch (err) {
        console.warn("Video compression error, fallback to original:", err);
      } finally {
        setIsCompressingVideo(false);
      }
    }

    const maxSize = 20 * 1024 * 1024; // 20MB limit
    if (processedFile.size > maxSize) {
      setVideoFileError(
        t("videoSizeLimit") || "Video size must not exceed 20MB (please use YouTube link for larger videos)"
      );
      e.target.value = "";
      return;
    }

    setVideoFileError("");
    setFieldValue("video", processedFile, true);
    setFieldTouched("video", true, false);
    // User can only upload a video file OR add a YouTube URL, not both
    setFieldValue("youtubeUrl", "", true);
    setFieldTouched("youtubeUrl", false, false);
    e.target.value = "";
  };

  // Remove uploaded video
  const handleRemoveVideo = (e) => {
    e?.stopPropagation?.();
    setVideoFileError("");
    setFieldValue("video", null, true);
    setFieldTouched("video", true, false);
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  // Safely manage cover image preview with automatic URL cleanup to prevent memory leaks
  const [coverPreview, setCoverPreview] = useState("");
  const thumbnailFileVal = values.thumbnail || values.thumbnailWeb;
  useEffect(() => {
    let createdUrl = "";
    if (thumbnailFileVal instanceof File || thumbnailFileVal instanceof Blob) {
      createdUrl = URL.createObjectURL(thumbnailFileVal);
      setCoverPreview(createdUrl);
    } else if (typeof thumbnailFileVal === "string") {
      setCoverPreview(thumbnailFileVal);
    } else {
      setCoverPreview("");
    }

    return () => {
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [thumbnailFileVal]);

  // Safely manage gallery items previews with automatic URL cleanup
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  useEffect(() => {
    const createdUrls = [];
    const previews = galleryItems.map((item) => {
      if (item instanceof File || item instanceof Blob) {
        const url = URL.createObjectURL(item);
        createdUrls.push(url);
        return url;
      }
      if (typeof item === "string") return item;
      return "";
    });
    setGalleryPreviews(previews);

    return () => {
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryItems]);

  // Handle single cover image upload with validation + compression
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setIsCompressingImage(true);
      try {
        const compressed = await compressImage(file, { maxWidthOrHeight: 1920, quality: 0.8, maxSizeMB: 1 });
        setFieldValue("thumbnail", compressed);
        setFieldValue("thumbnailWeb", compressed);
        setFieldTouched("thumbnail", true, false);
        setFieldTouched("thumbnailWeb", true, false);
      } catch (_) {
        setFieldValue("thumbnail", file);
        setFieldValue("thumbnailWeb", file);
        setFieldTouched("thumbnail", true, false);
        setFieldTouched("thumbnailWeb", true, false);
      } finally {
        setIsCompressingImage(false);
      }
    }
    e.target.value = "";
  };

  // Remove cover image
  const handleRemoveCover = (e) => {
    e.stopPropagation();
    setFieldValue("thumbnail", null);
    setFieldValue("thumbnailWeb", null);
    setFieldTouched("thumbnail", true, false);
    setFieldTouched("thumbnailWeb", true, false);
  };

  // Handle multiple gallery upload (min 4, max 15) with validation + compression
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length > 0) {
      const remainingAllowed = 15 - galleryItems.length;
      if (remainingAllowed > 0) {
        const addedFiles = files.slice(0, remainingAllowed);
        setIsCompressingImage(true);
        try {
          const compressedFiles = await Promise.all(
            addedFiles.map((f) =>
              compressImage(f, { maxWidthOrHeight: 1920, quality: 0.8, maxSizeMB: 1 }).catch(() => f)
            )
          );
          const nextList = [...galleryItems, ...compressedFiles];
          setFieldValue("gallary", nextList);
          setFieldValue("gallery", nextList);
          setFieldTouched("gallary", true, false);
          setFieldTouched("gallery", true, false);
        } finally {
          setIsCompressingImage(false);
        }
      }
    }
    e.target.value = "";
  };

  // Remove single gallery item
  const handleRemoveGalleryItem = (index) => {
    const updated = galleryItems.filter((_, i) => i !== index);
    setFieldValue("gallary", updated);
    setFieldValue("gallery", updated);
    setFieldTouched("gallary", true, false);
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
      dir={isAr ? "rtl" : "ltr"}
      aria-labelledby="step2-title"
      className="bg-white rounded-2xl border border-border p-5 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none flex flex-col gap-8"
    >
      {/* 1. Card Header */}
      <div className="text-start">
        <h2
          id="step2-title"
          className="font-somar text-xl font-medium text-textDark leading-6"
        >
          {t("cardTitle")}
        </h2>
        <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
          {t("cardSubtitle")}
        </p>
      </div>

      {/* 2. Section 1: Trip Cover Image */}
      <div className="flex flex-col gap-4 text-start" id="thumbnailWeb">
        <div>
          <h3 className="font-ibm text-base font-bold text-textDark leading-5">
            {t("tripImageTitle")} <span className="text-error">*</span>
          </h3>
          <p className="font-ibm text-sm sm:text-base font-normal text-textLight leading-6 mt-1 whitespace-pre-line">
            {t("tripImageSubtitle")}
          </p>
        </div>

        {/* Cover Preview Container */}
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

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={isCompressingImage}
            className="w-full h-[44px] rounded-lg border-2 border-mainColor text-textDark hover:bg-mainColor/10 font-ibm text-base font-bold flex items-center justify-center cursor-pointer transition-colors duration-200 select-none disabled:opacity-60 disabled:cursor-not-allowed gap-2"
          >
            {isCompressingImage ? (
              <>
                <CircularProgress size={16} color="inherit" />
                <span className="text-sm">{t("compressingImage") || "جاري ضغط الصورة..."}</span>
              </>
            ) : (
              coverPreview ? t("changeImageBtn") : t("uploadImageBtn")
            )}
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

      {/* 3. Section 2: Image Gallery */}
      <div className="flex flex-col gap-4 pt-2 text-start" id="gallery">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-ibm text-base font-bold text-textDark leading-5 flex items-center gap-1.5">
              <span>{t("gallerySectionTitle")}</span>
              <span className="text-error">*</span>
            </h3>
            <p className="font-ibm text-sm sm:text-base font-normal text-textLight leading-6 mt-1">
              {t("gallerySectionSubtitle")}
            </p>
          </div>

          {/* Gallery Items Count Pill */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span
              className={cn(
                "text-xs font-bold px-3 py-1 rounded-full font-ibm",
                galleryItems.length >= 4
                  ? "text-mainColor bg-mainColor/10"
                  : "text-secColor bg-secColor/10"
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
                    : "border-border",
                  !isUploaded && "cursor-pointer hover:border-mainColor/50"
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
                        className="bg-error/90 hover:bg-error text-white p-2 rounded-lg transition-colors cursor-pointer shadow-sm"
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
                  <div className="text-textLight text-xs font-ibm flex flex-col items-center gap-1">
                    <span className="text-xl leading-none font-light text-textLight/80">
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
              <p className="text-xs text-textLight font-ibm">
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
              className="h-12 px-6 rounded-lg bg-mainColor hover:bg-titleColor text-white font-ibm font-bold text-base leading-5 flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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

      {/* 4. Section 3: Product Video Upload */}
      <div className="flex flex-col gap-4 pt-4 border-t border-border text-start" id="video">
        <div>
          <h3 className="font-ibm text-base font-bold text-textDark leading-5 flex items-center gap-2">
            <OndemandVideoOutlinedIcon className="w-5 h-5 text-mainColor" />
            <span>{t("videoSectionTitle")}</span>
          </h3>
          <p className="font-ibm text-sm sm:text-base font-normal text-textLight leading-6 mt-1">
            {t("videoSectionSubtitle")}
          </p>
        </div>

        {/* Video Preview or Upload Box */}
        <div className="flex flex-col gap-3 max-w-[540px] w-full">
          {videoPreview ? (
            <div className="flex flex-col gap-3">
              <div className="w-full rounded-xl overflow-hidden bg-black border border-gray-200 relative aspect-video flex items-center justify-center shadow-xs">
                <video
                  src={videoPreview}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Video Info and Controls */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-homeBg/40 border border-border text-xs sm:text-sm">
                <div className="flex items-center gap-2 overflow-hidden text-ellipsis">
                  <OndemandVideoOutlinedIcon className="w-4 h-4 text-textLight shrink-0" />
                  <span className="font-medium text-textDark truncate max-w-[220px] sm:max-w-[300px]">
                    {videoMetadata.name}
                  </span>
                  {videoMetadata.size > 0 && (
                    <span className="text-textLight font-ibm shrink-0">
                      ({formatFileSize(videoMetadata.size)})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="text-xs font-semibold text-mainColor hover:underline cursor-pointer"
                  >
                    {t("changeVideoBtn")}
                  </button>
                  <span className="text-border">|</span>
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="text-xs font-semibold text-error hover:text-error/80 flex items-center gap-1 cursor-pointer"
                    title={t("removeVideo")}
                  >
                    <DeleteOutlineIcon className="w-3.5 h-3.5" />
                    <span>{t("removeVideo")}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : isCompressingVideo ? (
            <div className="w-full p-4 rounded-xl border border-mainColor/30 bg-mainColor/5 flex flex-col items-center justify-center gap-2.5">
              <div className="flex items-center gap-2 text-mainColor font-somar font-bold text-sm">
                <CircularProgress size={18} color="inherit" />
                <span>{t("videoCompressing")}</span>
                {compressionProgress > 0 && <span>{compressionProgress}%</span>}
              </div>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-mainColor h-full transition-all duration-200"
                  style={{ width: `${Math.max(5, compressionProgress)}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <button
                type="button"
                disabled={hasYoutubeUrl}
                onClick={() => {
                  if (!hasYoutubeUrl) videoInputRef.current?.click();
                }}
                className={cn(
                  "w-full h-[52px] rounded-xl border-2 border-dashed font-ibm text-sm sm:text-base font-medium flex items-center justify-center gap-2.5 transition-all duration-200 select-none",
                  hasYoutubeUrl
                    ? "border-border bg-disabled/20 text-disabled cursor-not-allowed opacity-60"
                    : "border-border hover:border-mainColor bg-homeBg/30 hover:bg-mainColor/[0.02] text-textDark cursor-pointer"
                )}
              >
                <OndemandVideoOutlinedIcon className={cn("w-5 h-5", hasYoutubeUrl ? "text-disabled" : "text-mainColor")} />
                <span>{t("uploadVideoBtn")}</span>
                <span className="text-xs text-textLight font-normal">
                  (MP4, WebM, MOV, OGG — max 20MB)
                </span>
              </button>
              {hasYoutubeUrl && (
                <p className="text-xs text-secColor font-medium mt-1.5 flex items-center gap-1.5">
                  <span>ℹ️</span>
                  <span>{t("youtubeEnteredNotice")}</span>
                </p>
              )}
            </div>
          )}

          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            className="hidden"
            onChange={handleVideoUpload}
          />

          {showVideoError && (
            <p className="text-xs text-error font-medium">{videoError}</p>
          )}
        </div>
      </div>

      {/* 5. Section 4: YouTube Video Link */}
      <div className="flex flex-col gap-4 pt-4 border-t border-border text-start" id="youtubeUrl">
        <div>
          <h3 className="font-ibm text-base font-bold text-textDark leading-5 flex items-center gap-2">
            <YouTubeIcon className="w-5 h-5 text-error" />
            <span>{t("youtubeSectionTitle")}</span>
          </h3>
          <p className="font-ibm text-sm sm:text-base font-normal text-textLight leading-6 mt-1">
            {t("youtubeSectionSubtitle")}
          </p>
        </div>

        {/* YouTube URL Input with Live Embed Preview */}
        <div className="flex flex-col gap-4 max-w-[540px] w-full">
          <div className="relative flex items-center">
            {/* YouTube Icon */}
            <div className="absolute start-3.5 flex items-center justify-center pointer-events-none text-error">
              <YouTubeIcon className="w-5 h-5" />
            </div>

            <input
              type="url"
              name="youtubeUrl"
              disabled={hasVideoFile}
              value={values.youtubeUrl || ""}
              onChange={(e) => {
                const val = e.target.value;
                setFieldValue("youtubeUrl", val, true);
                setFieldTouched("youtubeUrl", true, false);
                if (val && val.trim() && values.video) {
                  handleRemoveVideo();
                }
              }}
              placeholder={t("youtubeUrlPlaceholder")}
              dir="ltr"
              className={cn(
                "w-full h-12 ps-11 pe-10 rounded-xl border font-somar text-sm transition-all outline-none",
                hasVideoFile
                  ? "border-border bg-disabled/20 text-disabled cursor-not-allowed opacity-60"
                  : showYoutubeError
                  ? "border-error focus:border-error ring-1 ring-error/30 bg-white text-textDark"
                  : "border-border hover:border-mainColor focus:border-mainColor focus:ring-1 focus:ring-mainColor/30 bg-white text-textDark"
              )}
            />

            {/* Clear button if URL is entered */}
            {values.youtubeUrl && !hasVideoFile && (
              <button
                type="button"
                onClick={() => {
                  setFieldValue("youtubeUrl", "", true);
                  setFieldTouched("youtubeUrl", true, false);
                }}
                className="absolute end-3 w-6 h-6 rounded-full flex items-center justify-center text-textLight hover:text-textDark hover:bg-buttonsHover/20 transition-colors cursor-pointer"
                title="Clear"
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </button>
            )}
          </div>

          {hasVideoFile && (
            <p className="text-xs text-secColor font-medium flex items-center gap-1.5">
              <span>ℹ️</span>
              <span>{t("videoUploadedNotice")}</span>
            </p>
          )}

          {showYoutubeError && (
            <p className="text-xs text-error font-medium">{youtubeError}</p>
          )}

          {/* Live YouTube Embedded Player Preview */}
          {youtubeVideoId && (
            <div className="space-y-2 animate-fadeIn">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xs border border-gray-200 bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}`}
                  title="YouTube video player preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
              <p className="text-xs text-textLight font-ibm">
                ✓ {t("videoUploaded")}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(Step2Gallery);
