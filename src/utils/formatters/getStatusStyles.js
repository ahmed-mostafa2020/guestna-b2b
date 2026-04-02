import { TRIP_STATUS } from "@constants/tripStatus";

const VALID_STATUSES = new Set(Object.values(TRIP_STATUS));

/**
 * Returns Tailwind CSS classes for a status badge based on trip status.
 * Falls back to neutral styles for unknown values; emits a console warning in dev.
 *
 * @param {string} status - Trip status value from TRIP_STATUS constants
 * @returns {string} Tailwind CSS class string
 */
export const getStatusStyles = (status) => {
  if (process.env.NODE_ENV !== "production" && status && !VALID_STATUSES.has(status)) {
    console.warn(
      `[getStatusStyles] Unknown status: "${status}". Expected one of: ${[...VALID_STATUSES].join(", ")}`
    );
  }

  switch (status) {
    case TRIP_STATUS.APPROVED:
    case TRIP_STATUS.DONE:
      return "bg-status-success-bg text-status-success-fg border border-status-success-border";

    case TRIP_STATUS.PENDING:
    case TRIP_STATUS.PENDING_COMPANY_APPROVAL:
      return "bg-status-warning-bg text-status-warning-fg border border-status-warning-border";

    case TRIP_STATUS.SCHEDULED:
      return "bg-status-info-bg text-status-info-fg border border-status-info-border";

    case TRIP_STATUS.ON_HOLD:
      return "bg-status-hold-bg text-status-hold-fg border border-status-hold-border";

    case TRIP_STATUS.CANCELLED:
    case TRIP_STATUS.REJECTED:
      return "bg-status-danger-bg text-status-danger-fg border border-status-danger-border";

    case TRIP_STATUS.ENDED:
    default:
      return "bg-status-neutral-bg text-status-neutral-fg border border-status-neutral-border";
  }
};
