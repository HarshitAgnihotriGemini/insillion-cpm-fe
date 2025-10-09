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
      gross_temp: data?.gross_temp || 0,
      terrorism_temp: data?.terrorism_temp || 0,
      premium_value: data?.premium_value || 0,
      total_tax: data?.total_tax || 0,
      total_premium: data?.total_premium || 0,
      nstp_flag: data?.nstp_flag === 'Yes',
      nstp_reason: data?.nstp_reason || '',
      clause_wordings: data?.clause_wordings || [],
    };
    return quoteRes;
  }
}
