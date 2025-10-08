import { Injectable } from '@angular/core';
import { Adapter } from '@app/shared/interfaces/adapter';
import { QuoteReq } from './quote-req.model';

@Injectable({
  providedIn: 'root',
})
export class QuoteReqService implements Adapter<QuoteReq> {
  constructor() {}

  adapt(form: any, isFinalize = false): QuoteReq {
    const quoteReq: QuoteReq = {
      ...form?.formData,
      quote_id: form?.quote_id || '',
      product_id: form?.productId,
      transaction_type: 'New', //
      pakage_code: 'EPM', //
      settings_user_type: 'External', //
      branch_state: 'Tamilnadu', //
      branch_id: 'T3', //
    };

    if (isFinalize) {
      quoteReq['_ready'] = '1';
      quoteReq['__finalize'] = 1;
    }
    return quoteReq;
  }
}
