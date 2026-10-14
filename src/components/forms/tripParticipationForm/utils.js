/** Builds the payload for PATCH profile/organizationTrips/generate/url/:id */
export const buildParticipationPayload = (values) => ({
  proposedServices: values.proposedServices || [],
  profitAmount: values.hasSchoolProfit ? Number(values.schoolProfit) || 0 : 0,
  gatheringLocation: {
    lat: values.gatheringLocation?.lat || "",
    lng: values.gatheringLocation?.lng || "",
  },
});
