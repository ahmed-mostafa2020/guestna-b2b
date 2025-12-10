import { useTranslations } from "next-intl";
import {
  GroupIcon,
  CalendarIcon,
  LocationIcon,
  SuitcaseIcon,
} from "@assets/svg";
import FeaturedCard from "./FeaturedCard";

export default function FeatureCardListing() {
  const t = useTranslations("profile.tables.orders.features");

  const features = [
    {
      icon: <SuitcaseIcon />,
      title: t("customizedActivities"),
      bgColor: "var(--color-main)",
    },
    {
      icon: <LocationIcon />,
      title: t("uniqueDestinations"),
      bgColor: "var(--color-secondary)",
    },
    {
      icon: <CalendarIcon />,
      title: t("flexibleTimes"),
      bgColor: "var(--color-badge)",
    },
    {
      icon: <GroupIcon />,
      title: t("privateGroups"),
      bgColor: "black",
    },
  ];

  const renderedFeatures = features.map((feature, index) => (
    <FeaturedCard
      key={index}
      icon={feature.icon}
      title={feature.title}
      bgColor={feature.bgColor}
    />
  ));

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {renderedFeatures}
    </section>
  );
}
