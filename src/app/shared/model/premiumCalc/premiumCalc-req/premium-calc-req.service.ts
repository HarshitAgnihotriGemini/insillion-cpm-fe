import { Injectable } from '@angular/core';
import { Adapter } from '@app/shared/interfaces/adapter';
import { PremiumCalcReq } from './premiumCalc-req.model';

@Injectable({
  providedIn: 'root',
})
export class PremiumCalcReqService implements Adapter<PremiumCalcReq> {
  constructor() {}

  adapt(form: any): PremiumCalcReq {
    const premReq: PremiumCalcReq = {
      inputs: {
        wf_id: '32',
        product_id: form?.productId,
        product_lob: 'Engineering',
        imd_code: form?.formData?.imd_code || '',
        ...(form?.page_no !== 0
          ? {
              ...form?.formData,
              transaction_type: 'New',
              pakage_code: 'EPM',
              settings_user_type: 'External',
              branch_state: 'Tamilnadu',
              branch_id: 'T3',
            }
          : {}),
      },
      outputs: ['gross_premium', 'nstp_flag'],
    };

    return premReq;
  }
}
