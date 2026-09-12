"use client";

import { useTranslations } from "next-intl";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import headerSection from "@assets/sectionBackground/bookWithConfidenceHeader.png";

const SIDEBAR_ICON_SX = { fontSize: 24, color: "var(--color-title)" };

const ProcessSidebar = () => {
  const t = useTranslations("providerRegister.sidebar");

  const processSteps = [
    {
      title: t("steps.register.title"),
      description: t("steps.register.description"),
      icon: <HowToRegOutlinedIcon sx={SIDEBAR_ICON_SX} />,
    },
    {
      title: t("steps.review.title"),
      description: t("steps.review.description"),
      icon: <DescriptionOutlinedIcon sx={SIDEBAR_ICON_SX} />,
    },
    {
      title: t("steps.qualify.title"),
      description: t("steps.qualify.description"),
      icon: <AccessTimeOutlinedIcon sx={SIDEBAR_ICON_SX} />,
    },
  ];

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
      <FrameWithImagedHeader
        imageSrc={headerSection}
        withBorder={true}
        className="overflow-hidden"
        bodyClassName="!px-4 !py-6"
      >
        <h2 className="text-xl font-semibold text-titleColor font-somar">
          {t("title")}
        </h2>

        <div className="flex flex-col gap-6">
          {processSteps.map((processStep) => (
            <div key={processStep.title} className="flex gap-4 items-start">
              <div className="bg-buttonsHover size-12 rounded-xl flex items-center justify-center shrink-0">
                {processStep.icon}
              </div>
              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <h3 className="text-lg font-semibold text-textDark font-somar">
                  {processStep.title}
                </h3>
                <p className="text-sm font-medium text-textLight font-somar leading-relaxed">
                  {processStep.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FrameWithImagedHeader>

      <div className="bg-buttonsHover border border-border rounded-2xl px-6 py-5">
        <p className="text-base font-medium text-textDark font-somar leading-relaxed">
          {t("privacy")}
        </p>
      </div>
    </aside>
  );
};

export default ProcessSidebar;
