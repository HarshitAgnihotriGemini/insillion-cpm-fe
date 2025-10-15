export const ENVIRONMENTS = {
  DEV: 'DEV',
  UAT: 'UAT',
  PREPROD: 'PREPROD',
  PROD: 'PROD',
};

export const DATEFORMATS = {
  DDMMYYYY_SLASH: 'DD/MM/YYYY',
  MMDDYYYY_SLASH: 'MM/DD/YYYY',
  YYYYMMDD_HYPHEN: 'YYYY-MM-DD',
};

export const MASKS = {
  PHONE: '0000000000',
  DATE: 'd0/M0/0000',
  PINCODE: '000000',
  YYYY: '0000',
  NUMERIC: '0*',
};

export const REGEX_PATTERNS = {
  PAN: '^[A-Z]{5}[0-9]{4}[A-Z]{1}',
  EMAIL: '^[^\s@]+@[^\s@]+\.[^\s@]+',
  MOBILE: '^[6-9]\\d{9}',
  PINCODE: '^[1-9][0-9]{5}',
  GST: '^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1})',
  IFSC: '^[A-Z]{4}0[A-Z0-9]{6}',
  ALPHANUMERIC: '^[a-zA-Z0-9]*',
  ALPHABETS: '^[a-zA-Z]*',
  NUMBERS: '^[0-9]*',
};
