export interface PremiumCalcReq {
  inputs: {
    wf_id: string;
    product_id: string;
    product_lob: string;
    transaction_type: string;
    location_addon: any[]; //
    machinery: any[]; //
    policy_addon: any[]; //
    pakage_code: string; //
    settings_user_type: string;
    branch_state: string;
    branch_id: string;
    proposition_internal_user: string;
    _ready: string;
    __finalize: number;
  };
  outputs?: any;
}
