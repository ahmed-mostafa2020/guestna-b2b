"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import FileUploadGroup from "@components/forms/FileUploadGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

const StepMedia = () => {
  const t = useTranslations("providerProfile.products.modal");
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext();

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const currentGallery = values.gallery || [];
      setFieldValue("gallery", [...currentGallery, ...files]);
    }
  };

  const handleRemoveGalleryItem = (index) => {
    const currentGallery = values.gallery || [];
    setFieldValue(
      "gallery",
      currentGallery.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      {/* Gallery Images (Min 4) */}
      <div className="p-4 sm:p-5 bg-gray-50/60 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-titleColor">
              {t("fields.gallery")} <span className="text-error">*</span>
            </h4>
            <p className="text-xs text-subtitleColor">
              {t("subtitles.galleryHelp")}
            </p>
          </div>
          <span className="text-xs font-bold text-mainColor bg-mainColor/10 px-2.5 py-1 rounded-full">
            {t("fields.galleryCount", {
              count: (values.gallery || []).length,
              min: 4,
            })}
          </span>
        </div>

        {/* Upload Trigger */}
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-mainColor/40 rounded-xl cursor-pointer hover:bg-mainColor/5 transition-colors">
          <AddPhotoAlternateIcon className="w-8 h-8 text-mainColor mb-2" />
          <span className="text-xs font-semibold text-mainColor">
            {t("placeholders.clickToUploadGallery")}
          </span>
          <span className="text-[11px] text-gray-400 mt-0.5">
            {t("placeholders.uploadSpecs")}
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleGalleryUpload}
          />
        </label>

        {/* Gallery Thumbnails Grid */}
        {(values.gallery || []).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {values.gallery.map((item, idx) => {
              const previewUrl =
                typeof item === "string"
                  ? item
                  : item instanceof File
                  ? URL.createObjectURL(item)
                  : "";

              return (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden border border-border bg-white h-24 flex items-center justify-center"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={`Gallery item ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500 font-medium truncate px-2">
                      {item.name || `Image #${idx + 1}`}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryItem(idx)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <DeleteIcon className="w-5 h-5 text-red-400 hover:scale-110 transition-transform" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {touched.gallery && errors.gallery && (
          <p className="text-xs text-error font-medium">{errors.gallery}</p>
        )}
      </div>

      {/* Single Thumbnail */}
      <div>
        <label className="block mb-1.5 text-sm font-medium text-titleColor">
          {t("fields.thumbnailWeb")} <span className="text-error">*</span>
        </label>
        <FileUploadGroup
          name="thumbnailWeb"
          label=""
          accept="image/*"
          placeholder={t("placeholders.selectWebThumbnail")}
          value={values.thumbnailWeb}
          onFileChange={(e) => setFieldValue("thumbnailWeb", e.target.files[0])}
          errors={errors.thumbnailWeb}
          touched={touched.thumbnailWeb}
        />
      </div>

      {/* Optional Media File (PDF Only) & Video */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-border pt-5">
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.mediaFile")} <span className="text-xs text-subtitleColor">(PDF)</span>
          </label>
          <FileUploadGroup
            name="mediaFile"
            label=""
            accept=".pdf,application/pdf"
            placeholder={t("placeholders.selectMediaFile")}
            value={values.mediaFile}
            onFileChange={(e) => setFieldValue("mediaFile", e.target.files[0])}
          />
        </div>

        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.video")} <span className="text-xs text-subtitleColor">(MP4, WEBM)</span>
          </label>
          <FileUploadGroup
            name="video"
            label=""
            accept="video/*"
            placeholder={t("placeholders.video")}
            value={values.video}
            onFileChange={(e) => setFieldValue("video", e.target.files[0])}
          />
        </div>
      </div>
    </div>
  );
};

export default StepMedia;
