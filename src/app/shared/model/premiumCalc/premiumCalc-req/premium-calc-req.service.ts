import { Injectable } from '@angular/core';
import { Adapter } from '@app/shared/interfaces/adapter';
import { PremiumCalcReq } from './premiumCalc-req.model';
import * as cpmQuote from '@app/shared/schemas/cpm-quote.json';
import { UtilsService } from '@app/shared/utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class PremiumCalcReqService implements Adapter<PremiumCalcReq> {
  constructor(private readonly utilService: UtilsService) {}

  adapt(form: any): PremiumCalcReq {
    const formData = form?.formData || {};
    const machineryList = formData.machinery || [];
    const premReq: PremiumCalcReq = {
      inputs: {
        wf_id: '32',
        product_id: form?.productId,
        product_lob: 'Engineering',
        ...(form?.page_no !== 0
          ? {
              ...this.utilService.createReq(cpmQuote.sections, formData),
              location_addon: this.utilService.createLocationAddons(
                formData,
                machineryList,
              ),
              pakage_code: 'EPM',
              settings_user_type: sessionStorage.getItem('add_user_type') || '',
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