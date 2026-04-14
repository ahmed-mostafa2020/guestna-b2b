const formatNumbersUint = (number, singleUnit, groupUnit) => {
  if (number === 1) return `${number} ${singleUnit}`;
  if (number >= 2 && number <= 10) return `${number} ${groupUnit}`;
  return `${number} ${singleUnit}`;
};

export default formatNumbersUint;
