import { Injectable } from '@angular/core';
import { PremiumCalcRes } from './premiumCalc-res.model';
import { Adapter } from '@app/shared/interfaces/adapter';

@Injectable({
  providedIn: 'root',
})
export class PremiumCalcResService implements Adapter<PremiumCalcRes> {
  constructor() {}

  adapt(item: any): PremiumCalcRes {
    const data = item?.data;
    const cells = data?.cells;
    const changed = data?.changed;
    const premiumCalcRes: PremiumCalcRes = {
      settings_backdays: changed?.settings_backdays,
      settings_futuredays: changed?.settings_futuredays,
      gross_temp: cells?.gross_temp || 0,
      terrorism_temp: cells?.terrorism_temp || 0,
      premium_value: cells?.premium_value || 0,
      total_tax: cells?.total_tax || 0,
      total_premium: cells?.total_premium || 0,
      clause_wordings: changed?.clause_wordings || [],
    };
    return premiumCalcRes;
  }
}
