import { Injectable } from '@angular/core';
import { ApiService } from '@app/shared/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(private readonly api: ApiService) {}

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
      return await this.api.httpGetMethod(url, body);
    } catch (error: unknown) {
      throw error;
    }
  }
}
