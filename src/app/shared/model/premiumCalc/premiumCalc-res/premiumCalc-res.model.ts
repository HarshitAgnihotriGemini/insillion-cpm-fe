export interface PremiumCalcRes {
  settings_backdays: string;
  settings_futuredays: string;
  eq_zone: string;
  machinery: [{ max_si_cap: string; min_si_cap: string }];
  settings_user_type: string;
  iscreater: number;
  settings_terr_mandatory: string;
}
