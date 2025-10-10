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
    const premiumCalcRes: PremiumCalcRes = {
      settings_backdays: data?.changed?.settings_backdays,
      settings_futuredays: data?.changed?.settings_futuredays,
      eq_zone: data?.changed?.eq_zone,
      machinery: data?.cells?.machinery,
      settings_user_type: data?.changed?.settings_user_type,
      iscreater: data?.changed?.iscreater,
      settings_terr_mandatory: data?.changed?.settings_terr_mandatory,
      marine_required: data?.cells?.marine_required,
      settings_gpa_required: data?.changed?.settings_gpa_required,
      policy_addon: data?.cells?.policy_addon,
    };
    return premiumCalcRes;
  }
}
