"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import SchoolTripBookingSuccessCard from "@components/features/schoolTripBookingSuccess/SchoolTripBookingSuccessCard";

const SchoolTripBookingSuccessContent = ({ params }) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const tripId = params?.slug || params?.tripSlug || params?.id;

  // Read confirmation metadata from query params or sessionStorage
  const [bookingInfo, setBookingInfo] = useState({
    schoolName: "",
    adminName: "",
    schoolCode: "",
    tripName: "",
  });

  useEffect(() => {
    const paramSchoolName = searchParams.get("schoolName");
    const paramAdminName = searchParams.get("adminName");
    const paramSchoolCode = searchParams.get("schoolCode");
    const paramTripName = searchParams.get("tripName");

    let sessionData = null;
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(`schoolBookingSuccess_${tripId}`);
        if (stored) {
          sessionData = JSON.parse(stored);
        }
      } catch (err) {
        console.error("Error reading booking session storage:", err);
      }
    }

    setBookingInfo({
      schoolName:
        paramSchoolName ||
        sessionData?.schoolName ||
        "",
      adminName:
        paramAdminName ||
        sessionData?.adminName ||
        "",
      schoolCode:
        paramSchoolCode ||
        sessionData?.schoolCode ||
        "",
      tripName:
        paramTripName ||
        sessionData?.tripName ||
        "",
    });
  }, [searchParams, tripId]);

  // Set document title for SEO
  useEffect(() => {
    const pageTitle = t("pagesHead.title.schoolTripBookingSuccess");
    const appName = t("pagesHead.appName");
    document.title = `${appName} | ${pageTitle}`;
  }, [t]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#F8FAFC] pb-16">
      {/* Background Floating Accents matching Figma */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-12 -right-24 md:right-10 w-80 md:w-96 h-80 md:h-96 rounded-full bg-[#086F68] opacity-5 blur-[72px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 -left-24 md:left-10 w-80 md:w-96 h-80 md:h-96 rounded-full bg-[#C99635] opacity-10 blur-[72px]"
      />

      <div className="mt-6 md:mt-10 px-4 max-w-7xl mx-auto relative z-10 flex justify-center">
        <SchoolTripBookingSuccessCard
          schoolName={bookingInfo.schoolName}
          adminName={bookingInfo.adminName}
          tripName={bookingInfo.tripName}
          tripSlug={tripId}
        />
      </div>
    </main>
  );
};

const SchoolTripBookingSuccessPage = (props) => (
  <Suspense fallback={null}>
    <SchoolTripBookingSuccessContent {...props} />
  </Suspense>
);

export default SchoolTripBookingSuccessPage;
