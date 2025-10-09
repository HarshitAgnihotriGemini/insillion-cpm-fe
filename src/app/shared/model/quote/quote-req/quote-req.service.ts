import { Injectable } from '@angular/core';
import { Adapter } from '@app/shared/interfaces/adapter';
import { QuoteReq } from './quote-req.model';
import { UtilsService } from '@app/shared/utils/utils.service';
import * as cpmQuote from '@app/shared/schemas/cpm-quote.json';
@Injectable({
  providedIn: 'root',
})
export class QuoteReqService implements Adapter<QuoteReq> {
  constructor(private readonly utilService: UtilsService) {}

  adapt(form: any, isFinalize = false): QuoteReq {
    const quoteReq: QuoteReq = {
      ...form?.formData,
      quote_id: form?.quoteRes?.quoteId || '',
      product_id: form?.productId,
      transaction_type: form?.formData?.policy_transaction_type || '',
      pakage_code: 'EPM', //
      settings_user_type: sessionStorage.getItem('add_user_type') || '',
      branch_state: 'Tamilnadu', //
      branch_id: 'T3', //
      proposition_internal_user: form?.formData?.proposition_name || '',
      clause_wordings: form?.premiumCalcRes?.clause_wordings || [],
      ...this.utilService.createReq(cpmQuote.sections, form?.formData),
    };

    if (isFinalize) {
      quoteReq['_ready'] = '1';
      quoteReq['__finalize'] = 1;
    }
    return quoteReq;
  }
}
