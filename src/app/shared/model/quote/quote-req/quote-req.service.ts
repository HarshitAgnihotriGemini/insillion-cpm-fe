import { Injectable, Injector } from '@angular/core';
import { Adapter } from '@app/shared/interfaces/adapter';
import { QuoteReq } from './quote-req.model';
import { UtilsService } from '@app/shared/utils/utils.service';
import * as cpmQuote from '@app/shared/schemas/cpm-quote.json';
import { QuoteService } from '@app/features/quote/quote.service';
@Injectable({
  providedIn: 'root',
})
export class QuoteReqService implements Adapter<QuoteReq> {
  private _quoteService!: QuoteService;

  constructor(private readonly utilService: UtilsService, private readonly injector: Injector) {}

  private get quoteService(): QuoteService {
    if (!this._quoteService) {
      this._quoteService = this.injector.get(QuoteService);
    }
    return this._quoteService;
  }

  adapt(form: any, isFinalize = false): QuoteReq {
    const formData = form?.formData || {};
    const machineryList = formData.machinery || [];
    const quoteReq: QuoteReq = {
      quote_id: form?.quoteRes?.quoteId || '',
      product_id: form?.productId,
      transaction_type: form?.formData?.policy_transaction_type || '',
      pakage_code: 'EPM', //
      settings_user_type: form?.settings_user_type,
      branch_state: 'Tamilnadu', //
      branch_id: 'T3', //
      proposition_internal_user: sessionStorage.getItem('add_user_type')?.toLowerCase() === 'internal' ? form?.formData?.proposition_name || '' : '',
      imd_oa_broker_code: this.quoteService?.premiumCalcRes?.imd_oa_broker_code || "",
      imd_oa_agent: this.quoteService?.premiumCalcRes?.imd_oa_agent || "",
      imd_channel: this.quoteService?.premiumCalcRes?.imd_channel || "",
      imd_subchannel: this.quoteService?.premiumCalcRes?.imd_subchannel || "",
      clause_wordings: form?.premiumCalcRes?.clause_wordings || [],
      ...this.utilService.createReq(cpmQuote.sections, form?.formData),
      location_addon: this.utilService.createLocationAddons(
        formData,
        machineryList,
      ),
    };

    if (isFinalize) {
      quoteReq['_ready'] = '1';
      quoteReq['__finalize'] = 1;
    }
    return quoteReq;
  }
}
