import { CONSTANT_VALUES } from "../constants/constantValues";
import formateTripSelectedDate from "./FormateTripSelectedDate";

const buildFilter = ({
  tripsType,
  allTripsTypes,
  checkInDate,
  checkOutDate,
  activityDayDate,
  cities,
  budgetRange,
  categories,
  languages,
  targetAudiences,
  availableSeats,
  rate,
  searchTerm,
}) => {
  // if (allTripsTypes.length === 0) return {};

  const dateConfig = {};

  // Handle PACKAGE dates
  if (
    allTripsTypes.includes(CONSTANT_VALUES.PACKAGE) ||
    tripsType === CONSTANT_VALUES.PACKAGE
  ) {
    if (checkInDate.day != null && checkOutDate.day != null) {
      dateConfig.dateRange = {
        from: formateTripSelectedDate(checkInDate),
        to: formateTripSelectedDate(checkOutDate),
      };
    }
  }

  // Handle ACTIVITY dates
  if (
    allTripsTypes.includes(CONSTANT_VALUES.ACTIVITY) ||
    tripsType === CONSTANT_VALUES.ACTIVITY
  ) {
    if (activityDayDate.day != null) {
      dateConfig.day = formateTripSelectedDate(activityDayDate);
    }
  }

  return {
    ...dateConfig,
    ...(allTripsTypes?.length > 0 || tripsType
      ? { guestnaTripsTypes: allTripsTypes }
      : {}),
    ...(searchTerm?.length > 0 ? { searchTerm } : {}),
    ...(cities.length > 0 ? { cities } : {}),
    priceRange: {
      min: budgetRange?.min,
      max: budgetRange?.max,
    },
    ...(categories?.length > 0 ? { categories } : {}),
    ...(languages?.length > 0 ? { languages } : {}),
    ...(true ? { targetAudiences } : {}),
    availableSeats: availableSeats || 1,
    ...(rate !== null ? { rate } : {}),
  };
};

export default buildFilter;
