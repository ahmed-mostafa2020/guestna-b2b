const getSelectedTargetAudiences = (guests, agesIdsList) => {
  if (!guests || !agesIdsList) return []; // Return an empty array if guests or agesIdsList is invalid

  return Object.entries(guests)
    .filter(([_, value]) => value > 0)
    .map(([key]) => {
      const id = Object.keys(agesIdsList).find((id) => agesIdsList[id] === key);
      return id !== undefined ? id : null; // Ensure we don't return undefined
    })
    .filter((id) => id !== null); // Filter out any null values
};

export default getSelectedTargetAudiences;
