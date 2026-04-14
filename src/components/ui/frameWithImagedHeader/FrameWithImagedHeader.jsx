import Image from "next/image";
import { memo } from "react";

import preBookingSection from "@assets/sectionBackground/preBookingSection.png";

const FrameWithImagedHeader = ({
  imageSrc = preBookingSection,
  children,
  fontFamily = "font-somar",
  withBorder = false,
  imageBgColor = "#E2E6EE",
}) => {
  return (
    <section className={`text-base font-semibold rounded-xl ${fontFamily}`}>
      <figure className="overflow-hidden rounded-t-xl">
        <Image
          src={imageSrc}
          alt="header image"
          width={355}
          height={60}
          priority={true}
          className="w-full h-[60px] object-fill "
          style={{
            backgroundColor: imageBgColor ? imageBgColor : "transparent",
          }}
        />
      </figure>

      <div
        className={`flex flex-col gap-4 px-4 py-6 bg-white rounded-b-xl ${
          withBorder && "border shadow-xl border-[#E5E7EB]"
        }`}
      >
        {children}
      </div>
    </section>
  );
};

export default memo(FrameWithImagedHeader);
