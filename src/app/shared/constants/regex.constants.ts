
export const REGEX_PATTERNS = {
  PAN: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
  EMAIL: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$',
  MOBILE: '^[6-9]\d{9}$',
  PINCODE: '^[1-9][0-9]{5}$',
  GST: '^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})$',
  IFSC: '^[A-Z]{4}0[A-Z0-9]{6}$',
  ALPHANUMERIC: '^[a-zA-Z0-9]*$',
  ALPHABETS: '^[a-zA-Z]*$',
  NUMBERS: '^[0-9]*$',
};
