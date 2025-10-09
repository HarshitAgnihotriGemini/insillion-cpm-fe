export interface PremiumCalcRes {
  settings_backdays: string;
  settings_futuredays: string;
  gross_temp: number;
  terrorism_temp: number;
  premium_value: number;
  total_tax: number;
  total_premium: number;
  clause_wordings: any;
  eq_zone: string;
  machinery: [{ max_si_cap: string; min_si_cap: string }];
  settings_user_type: string;
  iscreater: number;
  settings_terr_mandatory: string;
}
