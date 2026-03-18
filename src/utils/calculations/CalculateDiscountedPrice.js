import formatCurrency from "./FormatCurrency";

const calculateDiscountedPrice = (
  price,
  discountedPercentage,
  isFormatting = true
) => {
  if (price <= 0) {
    throw new Error("Price must be greater than zero.");
  }

  const discountPrice = price - discountedPercentage * price;

  if (isFormatting) {
    return formatCurrency(discountPrice);
  } else {
    return discountPrice;
  }
};

export default calculateDiscountedPrice;
