export interface QuoteRes {
  data: any;
  policyId: string;
  quoteId: string;
  gross_temp: number;
  terrorism_temp: number;
  premium_value: number;
  total_tax: number;
  total_premium: number;
}
