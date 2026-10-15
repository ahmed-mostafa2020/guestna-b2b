/** Builds the payload for PATCH profile/organizationTrips/generate/url/:id */
export const buildParticipationPayload = (values) => ({
  // Omit services entirely when none are selected
  ...(values.proposedServices?.length && {
    proposedServices: values.proposedServices,
  }),
  profitAmount: values.hasSchoolProfit ? Number(values.schoolProfit) || 0 : 0,
  gatheringLocation: {
    lat: values.gatheringLocation?.lat || "",
    lng: values.gatheringLocation?.lng || "",
  },
});
