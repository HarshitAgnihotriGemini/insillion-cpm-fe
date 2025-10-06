import { Injectable } from '@angular/core';
import { ApiService } from '@app/shared/services/api.service';
import { DynamicOptionsService } from '@app/shared/services/dynamic-options.service';
import { QuoteFormService } from './quote-form.service';
import { QuoteReqService } from '@app/shared/model/quote/quote-req/quote-req.service';
import { Location } from '@angular/common';
import { QuoteRes } from '@app/shared/model/quote/quote-res/quote-res.model';
import { QuoteResService } from '@app/shared/model/quote/quote-res/quote-res.service';
import { CREATE_QUOTE } from '@app/shared/constants/routes';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private policyId = 'new';
  public quoteRes!: QuoteRes;

  constructor(
    private readonly quoteFormService: QuoteFormService,
    private readonly api: ApiService,
    private readonly dynamicOptionsService: DynamicOptionsService,
    private readonly quoteReqService: QuoteReqService,
    private readonly _location: Location,
    private readonly quoteResService: QuoteResService,
  ) {}

  /*  Getter for policyId
   To restrict the user from direct manipulating the policyId in components
   */
  get getPolicyId() {
    return this.policyId;
  }

  /*Setter for policyId
  To change the policyId in other components
  */
  set setPolicyId(policyId: string) {
    this.policyId = policyId;
  }

  public async getDetailByPolicyId() {
    try {
      const url = this.api.url + 'policy/' + this.getPolicyId;
      const res = await this.api.httpGetMethod(url);
      if (res?.['data']?.[0]) {
        this.quoteRes = this.quoteResService.adapt(res['data'][0]);
      } else if (res?.['txt']) {
        throw new Error('Error in Policy Response.');
      }
    } catch (error) {
      throw error;
    }
  }

  async fetchPropositionData(imdCode: string) {
    try {
      const url = this.api.url + 'cpm/proposition';
      //Harcode values added
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
      //Hardcode values added
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
      //Hardcode values added
      const res = await this.api.httpGetMethod(url, body);
      const options = res.data.map((item: any) => item?.settings_value);
      this.dynamicOptionsService.setOptions('productOptions', options);
      return options;
    } catch (error: unknown) {
      throw error;
    }
  }

  async fetchBranchList() {
    try {
      const url = this.api.url + 'cpm/cpm_branches';
      //hardcode values added
      const body = {
        settings_user_type: 'Internal',
        region: 'select',
        skip: '/v1/rater/',
      };
      const res = await this.api.httpGetMethod(url, body);
      this.dynamicOptionsService.setOptions('branchListOptions', res?.['data']);
    } catch (error: unknown) {
      throw error;
    }
  }

  async fetchPackagePlan(body: Object) {
    try {
      const url = this.api.url + 'cpm/package_plan';
      //hardcode values added
      const res = await this.api.httpGetMethod(url, body);
      this.dynamicOptionsService.setOptions(
        'packagePlanOptions',
        res?.['data'],
      );
    } catch (error: unknown) {
      throw error;
    }
  }

  async fetchLocationDetails(pincode: string) {
    try {
      const url = this.api.url + 'firstgen/pinCode';
      //Hardcode values added
      const body = {
        pincode: pincode,
        skip: '/v1/rater/',
      };
      const res = await this.api.httpGetMethod(url, body);
      const options = res?.['data']?.map(
        (item: Record<string, any>) => item?.['iaxzip_name'],
      );
      this.dynamicOptionsService.setOptions('locationOptions', options);
    } catch (error: unknown) {
      throw error;
    }
  }

  async fetchMachineryTypes() {
    try {
      const url = this.api.url + 'rater/lookup/cpm_machinery';
      //Hardcode values added
      const body = {
        proposition_name:
          this.quoteFormService.form.controls['proposition'].value,
        biz_type:
          this.quoteFormService.form.controls['policy_transaction_type'].value,
        effective_from: '45931',
        effective_to: '45931',
      };
      const res = await this.api.httpGetMethod(url, body);
      const options = res?.['data']?.map(
        (item: Record<string, any>) => item?.['machinery_type'],
      );
      this.dynamicOptionsService.setOptions('machineryTypeOptions', options);
    } catch (error: unknown) {
      throw error;
    }
  }

  async fetchVoluntaryExcess() {
    try {
      const url = this.api.url + 'cpm/voluntary_excess_tmpl';
      //Hardcode values added
      const body = {
        proposition: this.quoteFormService.form.controls['proposition'].value,
        policy_transaction_type:
          this.quoteFormService.form.controls['policy_transaction_type'].value,
        skip: '/v1/rater/',
      };
      const res = await this.api.httpGetMethod(url, body);
      this.dynamicOptionsService.setOptions(
        'voluntaryExcessOptions',
        res?.['data'],
      );
    } catch (error: unknown) {
      throw error;
    }
  }

  async fetchFloaterCoverage(
    proposition: string,
    policy_transaction_type: string,
  ) {
    try {
      const url = this.api.url + 'cpm/floater_coverage_in';
      const body = {
        proposition: proposition,
        policy_transaction_type: policy_transaction_type,
        skip: '/v1/rater/',
      };
      const res = await this.api.httpGetMethod(url, body);
      this.dynamicOptionsService.setOptions(
        'floaterCoverageOptions',
        res?.['data'],
      );
    } catch (error: unknown) {
      throw error;
    }
  }

  async saveQuote(isFinalize = false) {
    try {
      const url = this.api.url + 'quote';
      const body = this.quoteReqService.adapt(
        {
          formData: this.quoteFormService.form.value,
          productId: this.api.productId,
        },
        isFinalize,
      );
      const res = await this.api.httpPostMethod(url, body);
      if (res?.['data']?.[0]) {
        this.quoteRes = this.quoteResService.adapt(res?.['data']?.[0]);
        if (this.getPolicyId === 'new' && this.quoteRes?.policyId) {
          //To update the parameters in the url without reloading the page.
          this.setPolicyId = this.quoteRes?.policyId;
          this._location?.replaceState(
            `quote/${CREATE_QUOTE}/${this.getPolicyId}`,
          );
        }
      } else {
        throw new Error('Error in quote API!!!');
      }
    } catch (error) {
      throw error;
    }
  }
}
