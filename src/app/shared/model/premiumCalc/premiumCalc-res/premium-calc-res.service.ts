import { Injectable } from '@angular/core';
import { PremiumCalcRes } from './premiumCalc-res.model';
import { Adapter } from '@app/shared/interfaces/adapter';

@Injectable({
  providedIn: 'root',
})
export class PremiumCalcResService implements Adapter<PremiumCalcRes> {
  constructor() {}

  adapt(item: any): PremiumCalcRes {
    const data = item?.premium_calculation?.data;
    const premiumCalcRes: PremiumCalcRes = {
      settings_backdays: data?.settings_backdays || '',
      settings_futuredays: data?.settings_futuredays || '',
    };
    return premiumCalcRes;
  }
}
