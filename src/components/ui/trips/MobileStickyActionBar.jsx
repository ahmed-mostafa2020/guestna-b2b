import Image from "next/image";
import { memo } from "react";

import preBookingSection from "@assets/sectionBackground/preBookingSection.png";

// Mobile-only bar fixed at the bottom of the screen (same look as the parents trip sticky bar)
const MobileStickyActionBar = ({ children }) => {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-4px_25px_rgba(0,0,0,0.12)]">
      <div className="h-6 w-full overflow-hidden bg-[#E2E6EE] relative">
        <Image
          src={preBookingSection}
          alt=""
          fill
          priority
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-col gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] font-somar">
        {children}
      </div>
    </div>
  );
};

export default memo(MobileStickyActionBar);
