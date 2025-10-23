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
  machinery: [
    { max_si_cap: string; min_si_cap: string; type_machinery: string },
  ];
  settings_user_type: string;
  iscreater: number;
  settings_terr_mandatory: string;
  marine_required: string;
  settings_gpa_required: string;
  policy_addon: [{ addon_marine_premium: string }];
  imd_oa_broker_code: string;
  imd_oa_agent: string;
  imd_channel: string;
  imd_subchannel: string;
  errors: any;
}
