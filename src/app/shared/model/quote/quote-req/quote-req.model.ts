export interface QuoteReq {
  quote_id: string;
  product_id: string;
  transaction_type: string;
  location_addon: any[]; //
  machinery: any[]; //
  policy_addon: any[]; //
  pakage_code: string; //
  imd_oa_broker_code: string;
  imd_oa_agent: string;
  settings_user_type: string;
  branch_state: string;
  branch_id: string;
  imd_channel: string;
  imd_subchannel: string;
  _ready: string;
  __finalize: number;
}
