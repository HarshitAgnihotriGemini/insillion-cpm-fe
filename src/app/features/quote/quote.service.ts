import { Injectable } from '@angular/core';
import { ApiService } from '@app/shared/services/api.service';
import { DynamicOptionsService } from '@app/shared/services/dynamic-options.service';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(
    private readonly api: ApiService,
    private readonly dynamicOptionsService: DynamicOptionsService,
  ) {}

  async fetchPropositionData(imdCode: string) {
    try {
      const url = this.api.url + 'cpm/proposition';
      const body = {
        imd_oa_agent: '',
        imd_code: imdCode || '',
        channel: '',
        subchannel: '',
        settings_user_type: 'Internal',
        broker_name: '',
        branch: undefined,
        region: 'select',
        skip: '/v1/rater/',
      };
      const res = await this.api.httpGetMethod(url, body);
      this.dynamicOptionsService.setOptions(
        'propositionOptions',
        res?.['data'],
      );
      return res;
    } catch (error: unknown) {
      throw error;
    }
  }
  async getTransactionTypes(propositionName: string) {
    try {
      const url = this.api.url + 'rater/lookup/get_trans_type';
      const body = {
        proposition_name: propositionName,
        settings_name: 'policy_transaction_type',
        user_type: 'Internal',
        effective_from: '',
        effective_to: '',
      };
      const res = await this.api.httpGetMethod(url, body);
      const options = res.data.map((item: any) => item?.settings_value);
      this.dynamicOptionsService.setOptions('transactionTypeOptions', options);
      return options;
    } catch (error: unknown) {
      throw error;
    }
  }

  async fetchProductName(body: Object) {
    try {
      const url = this.api.url + 'rater/lookup/get_product_code';
      const res = await this.api.httpGetMethod(url, body);
      const options = res.data.map((item: any) => item?.settings_value);
      this.dynamicOptionsService.setOptions('productOptions', options);
      return options;
    } catch (error: unknown) {
      throw error;
    }
  }
}
