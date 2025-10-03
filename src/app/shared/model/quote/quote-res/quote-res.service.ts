import { Injectable } from '@angular/core';
import { Adapter } from '@app/shared/interfaces/adapter';
import { QuoteRes } from './quote-res.model';

@Injectable({
  providedIn: 'root',
})
export class QuoteResService implements Adapter<QuoteRes> {
  constructor() {}

  adapt(item: any): QuoteRes {
    const data = item?.quote?.data;
    const quoteRes: QuoteRes = {
      data: data,
      policyId: item?.policy_id,
      quoteId: item?.quote_id,
    };
    return quoteRes;
  }
}
