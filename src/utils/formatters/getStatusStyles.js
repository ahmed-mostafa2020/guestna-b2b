import { TRIP_STATUS } from "@constants/tripStatus";

/**
 * Returns Tailwind CSS classes for a status badge based on trip status.
 * @param {string} status - Trip status value from TRIP_STATUS constants
 * @returns {string} Tailwind CSS class string
 */
export const getStatusStyles = (status) => {
  switch (status) {
    case TRIP_STATUS.APPROVED:
    case TRIP_STATUS.DONE:
      return "bg-green-100 text-green-800 border border-green-200";

    case TRIP_STATUS.PENDING:
    case TRIP_STATUS.PENDING_COMPANY_APPROVAL:
      return "bg-yellow-100 text-yellow-800 border border-yellow-200";

    case TRIP_STATUS.SCHEDULED:
      return "bg-blue-100 text-blue-800 border border-blue-200";

    case TRIP_STATUS.ON_HOLD:
      return "bg-orange-100 text-orange-800 border border-orange-200";

    case TRIP_STATUS.CANCELLED:
    case TRIP_STATUS.REJECTED:
      return "bg-red-100 text-red-800 border border-red-200";

    case TRIP_STATUS.ENDED:
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};
