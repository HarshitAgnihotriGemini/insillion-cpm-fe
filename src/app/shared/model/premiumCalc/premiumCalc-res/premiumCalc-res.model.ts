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
  location_addon: [];
  party_id: string;
  endt_no: string;
  claim: string;
  existing_policy_expiry_date: string;
  proposer_name_primary_insured: string;
  mobile_no: string;
  email: string;
  pol_serv_branch_name: string;
  less_detariff: string;
  earthquake_req: string;
  terrorism_req: string;
  package_plan: string;
  floater_coverage_in: string;
  policy_start_date: string;
  policy_end_date: string;
  imd_code: string;
  policy_transaction_type: string;
  proposition_internal_user: string;
  errors: any;
}
