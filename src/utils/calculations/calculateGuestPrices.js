import { agesIdsList } from "../constants/targetAudiencesIds";

const calculateGuestPrices = (tripGuestsState, tripData, defaultPrice) => {
  const nonZeroGuests = Object.entries(tripGuestsState).filter(
    ([, value]) => value !== 0
  );

  // Calculate the total sum of all guests' prices
  const totalSum = nonZeroGuests.reduce((sum, [guestType, count]) => {
    // Find the ID for this guest type
    const id = Object.keys(agesIdsList).find(
      (key) => agesIdsList[key] === guestType
    );

    // Find the price from tripData.targetAud
    const targetAudItem = tripData?.find((item) => item._id === id);
    const price =
      targetAudItem && targetAudItem.price ? targetAudItem.price : defaultPrice;

    // Add to the total sum
    return sum + price * count;
  }, 0); // Initialize sum as 0

  return totalSum;
};

export default calculateGuestPrices;
