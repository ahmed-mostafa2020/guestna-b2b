import { newSarSmall } from "../assets/svg";

function formatCurrency(amount, locale = "en-US") {
  // locale = "ar"
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (isNaN(amount) || amount === null) return "";

  let formattedAmount = formatter.format(amount);

  // Remove the currency symbol "SAR" and any space after it
  formattedAmount = formattedAmount.replace(/SAR\s*/g, "");

  // Remove trailing zeros
  formattedAmount = formattedAmount.replace(/\.00$/, "");

  // return formattedAmount;
  return (
    <span className="centered gap-0.5 w-fit" dir="ltr">
      <span>{newSarSmall}</span>
      <span>{formattedAmount}</span>
    </span>
  );
}

export default formatCurrency;

// Handle Arabic locale
// if (locale === "ar") {
//   // Replace SAR with ريال, handling different possible formats
//   formattedAmount = formattedAmount
//     .replace("SAR", "ريال") // Basic replacement
//     .replace(/SAR\s+/g, "ريال ") // SAR with spacing
//     .replace(/\s+SAR/g, " ريال") // Spacing with SAR
//     .trim(); // Clean up any extra spaces
// }
