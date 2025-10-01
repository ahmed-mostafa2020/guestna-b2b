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

  // Construct API URL for fetching child data
  const apiUrl = `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.CHILD_INFO}/${bookingId}/${clientId}/${childId}`;

  const {
    data: childData,
    error,
    isLoading,
    refetch,
  } = useFetchData(
    apiUrl,
    {},
    {
      method: "GET",
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
          v
        />

        <div className="bg-white border mt-4 border-gray-200 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 pb-6">
            {t("confirmingData.title")}
          </h1>

          {/* Booking Information Display */}
          {childData && (
            <div className="mb-8 space-y-6">
              {/* Trip Information */}
              <div className="p-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-mainColor mb-4">
                  {t("confirmingData.tripInfo.title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-titleColor">
                      {t("confirmingData.tripInfo.name")}:
                    </span>
                    <span className="me-2 text-gray-900">
                      {childData?.trip?.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-titleColor">
                      {t("confirmingData.tripInfo.orderId")}:
                    </span>
                    <span className="me-2 text-gray-900">
                      {childData?.orderId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div className="p-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold text-mainColor mb-4">
                  {t("confirmingData.parentInfo.title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-titleColor">
                      {t("confirmingData.parentInfo.name")}:
                    </span>
                    <span className="me-2 text-gray-900">
                      {childData?.parent?.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-titleColor">
                      {t("confirmingData.parentInfo.phone")}:
                    </span>
                    <span className="me-2 text-gray-900" dir="ltr">
                      {childData?.parent?.phone || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-titleColor">
                      {t("confirmingData.parentInfo.nationalId")}:
                    </span>
                    <span className="me-2 text-gray-900">
                      {childData?.parent?.nationalId || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              {childData?.childs && childData.childs.length > 0 && (
                <div className="p-4 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-mainColor mb-4">
                    {t("confirmingData.studentInfo.title")}
                  </h2>
                  {childData.childs.map((child, index) => {
                    // Find the specific child we're working with
                    const isCurrentChild = child._id === childId;
                    if (!isCurrentChild) return null;

                    return (
                      <div key={child._id} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-titleColor">
                              {t("confirmingData.studentInfo.name")}:
                            </span>
                            <span className="me-2 text-gray-900">
                              {child.name || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-titleColor">
                              {t("confirmingData.studentInfo.nationalId")}:
                            </span>
                            <span className="me-2 text-gray-900">
                              {child.nationalId || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-titleColor">
                              {t("confirmingData.studentInfo.phone")}:
                            </span>
                            <span className="me-2 text-gray-900" dir="ltr">
                              {child.phone || "N/A"}
                            </span>
                          </div>

                          {/* <div>
                            <span className="font-medium text-orange-700">
                              {t("confirmingData.studentInfo.academicStage")}:
                            </span>
                            <span className="me-2 text-orange-900">
                              {child.academicStage || "N/A"}
                            </span>
                          </div> */}

                          {/* <div>
                            <span className="font-medium text-orange-700">
                              {t("confirmingData.studentInfo.grade")}:
                            </span>
                            <span className="me-2 text-orange-900">
                              {child.grade || "N/A"}
                            </span>
                          </div> */}
                        </div>

                        {/* Current National ID Image */}
                        {/* {child.nationalIdImage && (
                          <div className="mt-4">
                            <span className="font-medium text-orange-700">
                              {t("confirmingData.studentInfo.currentImage")}:
                            </span>
                            <div className="mt-2">
                              <img
                                src={child.nationalIdImage}
                                alt={t(
                                  "confirmingData.studentInfo.nationalIdImage"
                                )}
                                className="max-w-xs rounded-lg border border-gray-300 shadow-sm"
                              />
                            </div>
                          </div>
                        )} */}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ConfirmingDataPage;
