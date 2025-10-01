"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useFetchData } from "@hooks/useFetchData";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

import ChildImageUploadForm from "@components/forms/childImageUpload";

const ConfirmingDataPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const params = useParams();

  const { bookingId, clientId, childId } = params;

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.confirmingData"
    )}`;
  }, [t]);

  const {
    data: childData,
    error,
    isLoading,
    refetch,
  } = useFetchData(
    ` ${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.CHILD_INFO}/${bookingId}/${clientId}/${childId}`,
    {},
    {
      lang: locale,
    }
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        statusCode={error.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {t("confirmingData.title")}
          </h1>

          {/* Child Information Display */}
          {childData && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {t("confirmingData.childInfo.title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-600">
                    {t("confirmingData.childInfo.name")}:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {childData?.name || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    {t("confirmingData.childInfo.age")}:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {childData?.age || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    {t("confirmingData.childInfo.grade")}:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {childData?.grade || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    {t("confirmingData.childInfo.school")}:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {childData?.school || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Image Upload Form */}
          <ChildImageUploadForm
            bookingId={bookingId}
            clientId={clientId}
            childId={childId}
            childData={childData}
            onSuccess={() => {
              // Optionally refetch data or show success message
              refetch();
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default ConfirmingDataPage;
