"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { memo, useMemo, Fragment } from "react";
import ResponsiveGridLayout from "@components/ui/responsiveGridLayout";
import BookWithConfidenceSection from "@components/ui/trips/BookWithConfidenceSection";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import FilterAccordion from "@components/filtersBox/FilterAccordion";
import TripTags from "@components/features/tripDetails/gridSection/largeSizeGrid/tripTags";
import { TRIP_STATUS } from "@constants/tripStatus";
import formatCurrency from "@utils/formatters/FormatCurrency";
import formatNumbersUint from "@utils/formatters/FormatNumbersUint";
import formatDate from "@utils/formatters/FormateDate";

// Import accordionsDetails components
import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";
import SafeHtml from "@components/common/SafeHtml";
import ValidationMessage from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/ValidationMessage";
import Map from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/Map";
import ExtraInformation from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/ExtraInformation";
import Benefits from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/Benefits";
import ExemptedFromTrip from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/ExemptedFromTrip";
import MustHaveItems from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/MustHaveItems";

import {
  largeLocationIcon,
  largeTimeIcon,
  calenderIcon,
  schoolIcon,
} from "@assets/svg";

// ── Tags Listing ──
const EventTagsListing = ({ event }) => {
  const locale = useLocale();
  const t = useTranslations();

  // Cities
  const cities = useMemo(() => event?.cities || [], [event?.cities]);
  const renderCities = useMemo(() => {
    if (cities.length === 0) return null;
    if (cities.length === 1) return cities[0]?.name || "";
    return (
      <div className="flex gap-1 font-medium capitalize">
        {cities.map((city, index) => (
          <span key={city?._id || index}>
            {city?.name || ""}
            {index !== cities.length - 1 && " - "}
          </span>
        ))}
      </div>
    );
  }, [cities]);

  // Category
  const categoryName = event?.categories?.name || event?.supCategories?.[0]?.name || "";

  // Duration
  const duration = event?.duration;
  const eventDuration = duration
    ? formatNumbersUint(duration, t("common.day"), t("common.days"))
    : null;

  // Day date
  const day = event?.day;
  const eventDay = day
    ? formatDate(day, locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // School / organization name
  const organizationName =
    event?.organization?.name ||
    event?.organizations?.[0]?.name ||
    event?.company?.name ||
    null;

  const tagsList = useMemo(
    () => [
      { icon: largeLocationIcon, text: renderCities },
      { icon: largeTimeIcon, text: categoryName },
      { icon: largeTimeIcon, text: eventDuration },
      { icon: calenderIcon, text: eventDay },
      { icon: schoolIcon, text: organizationName },
    ],
    [renderCities, categoryName, eventDuration, eventDay, organizationName]
  );

  const renderedTagsList = tagsList.map(
    (tag, index) =>
      tag.text && <TripTags key={index} icon={tag.icon} text={tag.text} />
  );

  return (
    <div className="flex-wrap gap-3 flex items-center lg:gap-5">
      {renderedTagsList}
    </div>
  );
};

// ── Event Itinerary Local Component ──
const EventItinerary = ({ data, isAuth, locale }) => {
  const t = useTranslations();

  if (!isAuth && (!data || data.length === 0)) return <ValidationMessage />;

  const renderedData = data?.map((item, index) => {
    const toDoContent = item.toDo && typeof item.toDo === "object"
      ? item.toDo[locale] || item.toDo["ar"] || item.toDo["en"] || ""
      : item.toDo || "";

    return (
      <li key={index}>
        <FilterAccordion
          index={index}
          title={`${t(`daysNumber.${item.day}`) || `Day ${item.day}`}`}
          subAccordion={true}
        >
          <SafeHtml html={toDoContent} />
        </FilterAccordion>
      </li>
    );
  });

  return <ul className="flex flex-col gap-4">{renderedData}</ul>;
};

// ── Event Services Local Component ──
const EventServices = ({ data, isAuth }) => {
  if (!isAuth && (!data || data.length === 0)) return <ValidationMessage />;

  const fallbackIcon = "https://ik.imagekit.io/87h3o0r57q/default-image.jpg";

  const renderedData = data?.map((item, index) => (
    <li
      key={item._id || index}
      className={`flex flex-col min-w-[200px] w-[222px] p-6 border rounded-lg border-accordionBorder ${
        index === data?.length - 1 && "me-5"
      }`}
    >
      <ImageWithPlaceholder
        src={item?.service?.icon || fallbackIcon}
        alt={item?.service?.name || "service icon"}
        width={100}
        height={100}
        className="object-contain mb-3 w-[100px] h-[100px] rounded-md p-3"
      />

      <div className="text-center">
        <h4 className="font-medium text-black">{item?.service?.name || ""}</h4>
        <h4 className="text-sm">{item?.note || ""}</h4>
      </div>
    </li>
  ));

  return <ul className="flex gap-3 pb-3 overflow-x-auto">{renderedData}</ul>;
};

// ── Accordions Group ──
const EventAccordionsGroup = ({ event }) => {
  const t = useTranslations();
  const locale = useLocale();

  const accordionsList = [
    {
      isShown: !!event?.description,
      title: t("tripDetails.accordionsGroup.activity.description") || "Description",
      children: <p className="whitespace-pre-line">{event?.description}</p>,
    },
    {
      isShown: event?.services && event.services.length > 0,
      title: t("tripDetails.accordionsGroup.activity.contents") || "Included Services",
      children: <EventServices data={event?.services} isAuth={true} />,
    },
    {
      isShown: event?.exemptedFromTrip && event.exemptedFromTrip.length > 0,
      title: t("tripDetails.accordionsGroup.activity.exempted") || "Exempted",
      children: <ExemptedFromTrip data={event?.exemptedFromTrip} isAuth={true} />,
    },
    {
      isShown: event?.itinerary && event.itinerary.length > 0,
      title: t("tripDetails.accordionsGroup.activity.itinerary") || "Itinerary",
      children: <EventItinerary data={event?.itinerary} isAuth={true} locale={locale} />,
    },
    {
      isShown: !!event?.gatheringLocation,
      title: t("tripDetails.accordionsGroup.gatheringLocation") || "Gathering Location",
      children: (
        <Map
          lat={event?.gatheringLocation?.lat || 0}
          lng={event?.gatheringLocation?.lng || 0}
          locationLink={true}
          isAuth={true}
        />
      ),
    },
    {
      isShown: event?.mustHaveItems && event.mustHaveItems.length > 0,
      title: t("tripDetails.accordionsGroup.whatToBring") || "What to bring",
      children: <MustHaveItems data={event?.mustHaveItems} isAuth={true} />,
    },
    {
      isShown: event?.attributes && event.attributes.length > 0,
      title: t("tripDetails.accordionsGroup.extraInfo") || "Extra Info",
      children: <ExtraInformation data={event?.attributes} isAuth={true} />,
    },
    {
      isShown: event?.benefits && event.benefits.length > 0,
      title: t("tripDetails.accordionsGroup.benefits") || "Benefits",
      children: <Benefits data={event?.benefits} isAuth={true} />,
    },
  ];

  return (
    <>
      {accordionsList.map(
        (item, index) =>
          item.isShown && (
            <Fragment key={index}>
              <FilterAccordion index={index} title={item.title}>
                {item.children}
              </FilterAccordion>
            </Fragment>
          )
      )}
    </>
  );
};

// ── Left Side Grid ──
const EventLargeSizeGrid = ({ event }) => {
  return (
    <div className="flex flex-col gap-5">
      <EventTagsListing event={event} />
      <EventAccordionsGroup event={event} />
    </div>
  );
};

const EventSidebarSection = ({ event }) => {
  const t = useTranslations();
  const locale = useLocale();

  const price = Number(event?.price || 0);
  const discountedPrice = Number(event?.discountedPrice || 0);
  const hasDiscount = event?.discountedPrice && discountedPrice < price;
  const discountPercentage = price > 0 ? Math.round(((price - discountedPrice) / price) * 100) : 0;

  const endDate = new Date(event?.endAvailableBookingDay);
  const currentDate = new Date();
  const isBookingAvailable = endDate > currentDate;
  const isStopBooking = event?.isStopBooking;

  // Determine booking availability status
  const getBookingStatus = () => {
    if (event?.status === TRIP_STATUS.PENDING && event?.availableSeats <= 0) {
      return { canBook: false, messageKey: "noSeats" };
    }
    if (isStopBooking) {
      return { canBook: false, messageKey: "noSeats" };
    }
    if (event?.status === TRIP_STATUS.PENDING && !isBookingAvailable) {
      return { canBook: false, messageKey: "expired" };
    }

    switch (event?.status) {
      case TRIP_STATUS.PENDING:
        return { canBook: true, messageKey: null };
      case TRIP_STATUS.SCHEDULED:
        return { canBook: false, messageKey: "scheduled" };
      case TRIP_STATUS.DONE:
        return { canBook: false, messageKey: "done" };
      case TRIP_STATUS.CANCELLED:
        return { canBook: false, messageKey: "cancelled" };
      default:
        return { canBook: false, messageKey: "unknown" };
    }
  };

  const bookingStatus = getBookingStatus();

  const handleRegisterClick = () => {
    if (typeof window !== "undefined") {
      const target = document.querySelector("#event-registration-form");
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <FrameWithImagedHeader withBorder={true}>
      <div className="flex flex-col gap-1 text-start w-full transition-all duration-200 ease-in-out">
        {hasDiscount && (
          <div className="flex items-center gap-2">
            <span className="relative inline-block text-gray-400 font-ibm text-sm">
              {formatCurrency(price)}
              <span
                className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-[#ef4444] transform -rotate-[15deg] pointer-events-none"
                style={{ transformOrigin: "center" }}
              />
            </span>
            <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md text-xs font-semibold font-somar">
              {locale === "ar" ? `خصم ${discountPercentage}%` : `${discountPercentage}% OFF`}
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-2xl font-bold font-ibm text-mainColor">
            {formatCurrency(hasDiscount ? discountedPrice : price)}
          </span>
          <span className="text-2xl font-thin text-textLight">/</span>
          <span className="text-base font-normal text-textLight">
            {t("common.onePerson")}
          </span>
        </div>
      </div>

      {bookingStatus.canBook ? (
        <button
          onClick={handleRegisterClick}
          className="w-full px-8 py-3 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor hover:bg-linksHover hover:border-linksHover bg-mainColor"
        >
          {t("links.register")}
        </button>
      ) : (
        <div className="w-full p-6 text-center bg-gray-50 border-2 border-gray-200 rounded-lg">
          <div className="mb-2">
            <h4 className="text-lg font-semibold text-gray-800">
              {t(`booking.unavailable.${bookingStatus.messageKey}.title`) || "Unavailable"}
            </h4>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t(`booking.unavailable.${bookingStatus.messageKey}.subtitle`) || "Booking is currently unavailable."}
          </p>
        </div>
      )}
    </FrameWithImagedHeader>
  );
};

// ── Right Side Grid ──
const EventSmallSizeGrid = ({ event }) => {
  const t = useTranslations();

  return (
    <>
      <EventSidebarSection event={event} />
      <BookWithConfidenceSection />

      {event?.location && (
        <div className="flex flex-col gap-3 lg:gap-5">
          <h4 className="text-lg font-semibold text-mainColor lg:text-2xl">
            {t("bookWithConfidence.activityLocation") || "Event Location"}
          </h4>

          <Map
            lat={event?.location?.lat || 0}
            lng={event?.location?.lng || 0}
            locationLink={false}
            isAuth={true}
            height="h-48"
          />
        </div>
      )}
    </>
  );
};

// ── Main Page Layout Component ──
const EventDetailsGrid = ({ event }) => {
  return (
    <ResponsiveGridLayout
      LargeSizeGrid={EventLargeSizeGrid}
      SmallSizeGrid={EventSmallSizeGrid}
      largeSizeProps={{ event }}
      smallSizeProps={{ event }}
    />
  );
};

export default memo(EventDetailsGrid);
