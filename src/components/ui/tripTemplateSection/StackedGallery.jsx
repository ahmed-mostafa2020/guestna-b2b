import Image from "next/image";
import { useTranslations } from "next-intl";
import { GALLERY_CARD_POSITIONS } from "./utils";

/**
 * Stacked, slightly rotated image cards (end side — left in RTL, right in LTR).
 * @param {{ images: string[] }} props
 */
const StackedGallery = ({ images }) => {
  const t = useTranslations();

  if (!images?.length) return null;

  return (
    <div className="relative w-full lg:w-[45%] flex-shrink-0 h-[280px] sm:h-[320px] lg:h-[360px]">
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={`absolute overflow-hidden rounded-2xl border-4 border-white/80 bg-white/10 shadow-xl shadow-black/20 transition-transform duration-500 hover:z-[4] hover:rotate-0 hover:scale-[1.03] ${GALLERY_CARD_POSITIONS[index]}`}
        >
          <Image
            src={src}
            alt={t("providerMarketplace.galleryImageAlt", { index: index + 1 })}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 60vw, 25vw"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default StackedGallery;
