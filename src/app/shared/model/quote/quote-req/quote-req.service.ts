import { Injectable } from '@angular/core';
import { Adapter } from '@app/shared/interfaces/adapter';
import { QuoteReq } from './quote-req.model';

@Injectable({
  providedIn: 'root',
})
export class QuoteReqService implements Adapter<QuoteReq> {
  constructor() {}

  adapt(form: any): QuoteReq {
    const quoteReq: QuoteReq = {
      ...form?.formData,
      quote_id: '', //
      product_id: form?.productId,
      transaction_type: 'New', //
      pakage_code: 'EPM', //
      imd_oa_broker_code: 'OA000177', //
      imd_oa_agent: 'OA000177', //
      settings_user_type: 'External', //
      branch_state: 'Tamilnadu', //
      branch_id: 'T3', //
      imd_channel: 'AAR', //
      imd_subchannel: 'OEM', //
      // _ready: '1', //
      // __finalize: 1, //
    };

    console.log('Adapted QuoteReq:', quoteReq);
    return quoteReq;
  }
}
