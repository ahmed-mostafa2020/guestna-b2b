"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Container } from "@mui/material";

const TermsAndConditions = () => {
  const t = useTranslations();
  const termsT = useTranslations("termsPage");

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.termsAndConditions"
    )}`;
  }, [t]);

  const cancellationItems = [0, 1, 2, 3, 4, 5];

  return (
    <div className="bg-activityDetailsBg min-h-screen py-10 lg:py-16">
      <Container maxWidth="lg">
        {/* Header Hero Card */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mainColor to-secColor"></div>
          <h1 className="text-3xl md:text-4xl font-bold text-titleColor pb-4">
            {termsT("title")}
          </h1>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
          {/* Section 1: Definitions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-titleColor border-b border-gray-100 pb-6 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-mainColor inline-block"></span>
              {termsT("definitions.title")}
            </h2>
            <p className="text-textDark py-6 text-justify leading-relaxed">
              {termsT("definitions.subtitle")}
            </p>

            <div className="grid gap-4 md:grid-cols-1">
              {[
                "guestna",
                "client",
                "activities",
                "serviceProvider",
                "package",
                "day",
                "officialChannels",
              ].map((key) => (
                <div
                  key={key}
                  className="p-5 rounded-xl bg-gray-50/50 hover:bg-gray-50 border border-gray-100 transition-colors duration-200"
                >
                  <h3 className="font-bold text-mainColor text-lg pb-2">
                    {termsT(`definitions.${key}.term`)}
                  </h3>
                  <p className="text-textDark leading-relaxed text-justify">
                    {termsT(`definitions.${key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Terms and Conditions List */}
          <section>
            <h2 className="text-2xl font-bold text-titleColor border-b border-gray-100 pb-6 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-secColor inline-block"></span>
              {termsT("terms.title")}
            </h2>

            <div className="space-y-8">
              {/* 1. Compliance */}
              <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-bold text-titleColor pb-4 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-mainColor/10 text-mainColor flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  {termsT("terms.compliance.title")}
                </h3>
                <p className="text-textDark leading-relaxed text-justify pb-3">
                  {termsT("terms.compliance.p1")}
                </p>
                <p className="text-textDark leading-relaxed text-justify">
                  {termsT("terms.compliance.p2")}
                </p>
              </div>

              {/* 2. Reception */}
              <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-bold text-titleColor mb-4 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-mainColor/10 text-mainColor flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  {termsT("terms.reception.title")}
                </h3>
                <p className="text-textDark leading-relaxed text-justify pb-3">
                  {termsT("terms.reception.p1")}
                </p>
                <p className="text-textDark leading-relaxed text-justify">
                  {termsT("terms.reception.p2")}
                </p>
              </div>

              {/* 3. Property */}
              <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-bold text-titleColor pb-4 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-mainColor/10 text-mainColor flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  {termsT("terms.property.title")}
                </h3>
                <p className="text-textDark leading-relaxed text-justify pb-3">
                  {termsT("terms.property.p1")}
                </p>
                <p className="text-textDark leading-relaxed text-justify">
                  {termsT("terms.property.p2")}
                </p>
              </div>

              {/* 4. Cancellation */}
              <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-bold text-titleColor pb-4 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-mainColor/10 text-mainColor flex items-center justify-center font-bold text-sm">
                    4
                  </span>
                  {termsT("terms.cancellation.title")}
                </h3>
                <ul className="list-disc list-inside space-y-2.5 text-textDark leading-relaxed text-justify px-2">
                  {cancellationItems.map((idx) => (
                    <li key={idx} className="marker:text-mainColor">
                      {termsT(`terms.cancellation.item${idx}`)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 5. Supervision */}
              <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-bold text-titleColor pb-4 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-mainColor/10 text-mainColor flex items-center justify-center font-bold text-sm">
                    5
                  </span>
                  {termsT("terms.supervision.title")}
                </h3>
                <p className="text-textDark leading-relaxed text-justify pb-3">
                  {termsT("terms.supervision.p1")}
                </p>
                <p className="text-textDark leading-relaxed text-justify pb-3">
                  {termsT("terms.supervision.p2")}
                </p>
                <p className="text-textDark leading-relaxed text-justify pb-3">
                  {termsT("terms.supervision.p3")}
                </p>
                <p className="text-textDark leading-relaxed text-justify">
                  {termsT("terms.supervision.p4")}
                </p>
              </div>

              {/* 6. Behavior */}
              <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-bold text-titleColor pb-4 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-mainColor/10 text-mainColor flex items-center justify-center font-bold text-sm">
                    6
                  </span>
                  {termsT("terms.behavior.title")}
                </h3>
                <p className="text-textDark leading-relaxed text-justify pb-3">
                  {termsT("terms.behavior.p1")}
                </p>
                <p className="text-textDark leading-relaxed text-justify">
                  {termsT("terms.behavior.p2")}
                </p>
              </div>

              {/* 7. Guardian */}
              <div className="p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h3 className="text-xl font-bold text-titleColor pb-4 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-mainColor/10 text-mainColor flex items-center justify-center font-bold text-sm">
                    7
                  </span>
                  {termsT("terms.guardian.title")}
                </h3>
                <p className="text-textDark leading-relaxed text-justify pb-3">
                  {termsT("terms.guardian.p1")}
                </p>
                <p className="text-textDark leading-relaxed text-justify pb-3">
                  {termsT("terms.guardian.p2")}
                </p>
                <p className="text-textDark leading-relaxed text-justify">
                  {termsT("terms.guardian.p3")}
                </p>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
