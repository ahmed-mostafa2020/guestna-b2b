import { parsePhoneNumber } from "react-phone-number-input";

const toLatinDigits = (text) =>
  String(text)
    .replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 0x0660) // Arabic-Indic
    .replace(/[۰-۹]/g, (d) => d.charCodeAt(0) - 0x06f0); // Persian

const safeParse = (text, country) => {
  try {
    return parsePhoneNumber(text, country);
  } catch {
    return undefined;
  }
};

/**
 * Cleans a pasted/raw phone number into E.164 (e.g. "+966505547943"):
 * - Converts Arabic/Persian digits, strips spaces, dashes, brackets, etc.
 * - "00966..." -> "+966..."
 * - Removes a duplicated calling code ("+966 966 50...") and trunk zero ("+966 050...")
 * - Local numbers ("050...") are resolved using the current country.
 *
 * @param {string} raw
 * @param {string} [country] ISO country code (e.g. "SA")
 * @returns {string|undefined} E.164 number, or undefined if it can't be parsed
 */
export const normalizePhone = (raw, country) => {
  if (!raw) return undefined;

  let digits = toLatinDigits(raw)
    .trim()
    .replace(/[^\d+]/g, "");
  let international = digits.startsWith("+");
  digits = digits.replace(/\+/g, "");

  if (!international && digits.startsWith("00")) {
    digits = digits.slice(2);
    international = true;
  }
  if (!digits) return undefined;

  let parsed = safeParse(international ? `+${digits}` : digits, country);

  // e.g. "966505547943" pasted without "+"
  if (!international && !parsed?.isValid()) {
    const intl = safeParse(`+${digits}`);
    if (intl?.isValid()) parsed = intl;
  }

  if (parsed && !parsed.isValid()) {
    const code = parsed.countryCallingCode;
    let national = parsed.nationalNumber;
    while (national.startsWith(code) && national.length > code.length) {
      national = national.slice(code.length);
    }
    national = national.replace(/^0+/, "");
    const fixed = safeParse(`+${code}${national}`);
    if (fixed) parsed = fixed;
  }

  return parsed?.number || (international ? `+${digits}` : undefined);
};
