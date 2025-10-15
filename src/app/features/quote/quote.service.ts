import { Injectable } from '@angular/core';
import { ApiService } from '@app/shared/services/api.service';
import { DynamicOptionsService } from '@app/shared/services/dynamic-options.service';
import { QuoteFormService } from './quote-form.service';
import { QuoteReqService } from '@app/shared/model/quote/quote-req/quote-req.service';
import { Location } from '@angular/common';
import { QuoteRes } from '@app/shared/model/quote/quote-res/quote-res.model';
import { QuoteResService } from '@app/shared/model/quote/quote-res/quote-res.service';
import { CREATE_QUOTE } from '@app/shared/constants/routes';
import { PremiumCalcReqService } from '@app/shared/model/premiumCalc/premiumCalc-req/premium-calc-req.service';
import { FormService } from '@app/shared/services/form.service';
import { PremiumCalcResService } from '@app/shared/model/premiumCalc/premiumCalc-res/premium-calc-res.service';
import { PremiumCalcRes } from '@app/shared/model/premiumCalc/premiumCalc-res/premiumCalc-res.model';
import moment from 'moment';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from '@app/shared/utils/utils.service';
import { DynamicValidationService } from '@app/shared/services/dynamic-validation.service';
import { Router } from '@angular/router';
import { ErrorPopupService } from '@app/shared/services/error-popup.service';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private policyId = 'new';
  public quoteRes!: QuoteRes;
  public premiumCalcRes!: PremiumCalcRes;

  constructor(
    private readonly router: Router,
    private readonly quoteFormService: QuoteFormService,
    private readonly api: ApiService,
    private readonly dynamicOptionsService: DynamicOptionsService,
    private readonly quoteReqService: QuoteReqService,
    private readonly premiumCalcReqService: PremiumCalcReqService,
    private readonly premiumCalcResService: PremiumCalcResService,
    private readonly _location: Location,
    private readonly quoteResService: QuoteResService,
    private readonly formService: FormService,
    private readonly dynamicValidationService: DynamicValidationService,
    private readonly errorPopup: ErrorPopupService,
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

  get settingsUserType() {
    return sessionStorage.getItem('add_user_type') || '';
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
        settings_user_type: this.settingsUserType,
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
        settings_user_type: this.settingsUserType,
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
          this.quoteFormService.form.controls['proposition_name'].value,
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
        proposition:
          this.quoteFormService.form.controls['proposition_name'].value,
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

  async fetchStates() {
    try {
      const currentOptions =
        this.dynamicOptionsService.getCurrentOptions('stateOptions');
      if (currentOptions && currentOptions.length > 0) {
        return;
      }
      const url = this.api.url + 'rater/lookup/floater_state';
      const res = await this.api.httpGetMethod(url);
      const options = res.data.map((item: any) => item?.state);
      this.dynamicOptionsService.setOptions('stateOptions', options);
    } catch (error: unknown) {
      throw error;
    }
  }

  async saveQuote(isFinalize = false) {
    try {
      const url = this.api.url + 'quote';
      const body = this.quoteReqService.adapt(
        {
          formData: this.quoteFormService.form.getRawValue(),
          productId: this.api.productId,
          premiumCalcRes: this.premiumCalcRes,
          quoteRes: this.quoteRes,
          settings_user_type: this.settingsUserType,
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

  async premiumCalc(tag?: string, isValidationCheck: boolean = false) {
    try {
      const url =
        this.api.url +
        `product/calc/${this.api.productId}?wf_id=32&type=premium_calc`;
      const body = this.premiumCalcReqService.adapt({
        formData: this.quoteFormService.form.getRawValue(),
        productId: this.api.productId,
        page_no: tag === 'imd_code' ? 0 : 1,
        settings_user_type: this.settingsUserType,
      });
      const res = await this.api.httpPostMethod(url, body);
      const form = this.quoteFormService.form;
      if ((res?.status == -102 || res?.status == -1) && tag) {
        this.formService.setFieldError(form, tag, 'apiError', res?.txt);
        throw new Error(`Error in premium calc: ${res?.txt}`);
      }
      if (res?.data && res?.status == 0) {
        this.premiumCalcRes = this.premiumCalcResService.adapt(res);
        if (isValidationCheck && this.premiumCalcRes?.errors?.length > 0) {
          const errMsg = this.premiumCalcRes?.errors?.reduce(
            (acc: string, curr: { msg: string }) => acc + (curr?.msg ?? ''),
            '',
          );
          this.errorPopup.showErrorPopup(errMsg);
          throw new Error('Validations in Premium Calc API: ', errMsg);
        }

        this.formService.setFieldVisibility(
          'GPA',
          this.premiumCalcRes?.settings_gpa_required?.toLowerCase() == 'yes',
        );
        if (this.premiumCalcRes?.policy_addon?.[0]?.addon_marine_premium) {
          this.quoteFormService.form.controls['addon_marine_premium'].setValue(
            this.premiumCalcRes?.policy_addon?.[0]?.addon_marine_premium,
          );
          this.formService.setFieldVisibility('addon_marine_premium', true);
        }
        this.formService.setFieldVisibility(
          'addon_marine',
          this.premiumCalcRes?.marine_required?.toLowerCase() == 'yes',
        );
        if (this.premiumCalcRes?.marine_required?.toLowerCase() == 'yes') {
          this.quoteFormService.form.controls['addon_marine'].setValue(true);
          this.quoteFormService.form.controls['addon_marine'].disable();
        }
        if (this.premiumCalcRes.iscreater == 0) {
          this.quoteFormService.form.controls['marine_selection'].disable();
        }

        this.quoteFormService.form.controls['marine_selection'].setValue(
          'All Risk',
        );
        this.dynamicValidationService.updateRequiredStatus(
          'marine_selection',
          this.premiumCalcRes?.marine_required?.toLowerCase() == 'yes',
        );
        const propositionControl =
          this.quoteFormService.form.controls['proposition'];
        if (
          propositionControl &&
          this.premiumCalcRes.iscreater &&
          this.premiumCalcRes.settings_user_type
        ) {
          this.dynamicValidationService.updateRequiredStatus(
            'proposition',
            this.premiumCalcRes.iscreater == 1 &&
              this.premiumCalcRes.settings_user_type == 'Internal',
          );

          const newValidators = [];
          if (
            this.premiumCalcRes.iscreater == 1 &&
            this.premiumCalcRes.settings_user_type == 'Internal'
          ) {
            newValidators.push(Validators.required);
          }
          propositionControl.setValidators(newValidators);
          propositionControl.updateValueAndValidity();
        }
        const terrorismCoverControl =
          this.quoteFormService.form.controls['terrorism_req'];
        if (
          terrorismCoverControl &&
          this.premiumCalcRes.settings_terr_mandatory
        ) {
          this.dynamicValidationService.updateRequiredStatus(
            'terrorism_req',
            this.premiumCalcRes.settings_terr_mandatory.toLowerCase() == 'yes',
          );

          const newValidators = [];
          if (
            this.premiumCalcRes.settings_terr_mandatory.toLowerCase() == 'yes'
          ) {
            newValidators.push(Validators.required);
          }
          terrorismCoverControl.setValidators(newValidators);
          terrorismCoverControl.updateValueAndValidity();
        }

        this.quoteFormService.form.controls['eq_zone'].setValue(
          this.premiumCalcRes?.eq_zone,
        );
        const backDays = this.premiumCalcRes?.settings_backdays;
        const futureDays = this.premiumCalcRes?.settings_futuredays;

        const minDate =
          backDays !== undefined && backDays !== null
            ? moment().subtract(Number(backDays), 'days').toDate()
            : undefined;

        const maxDate =
          futureDays !== undefined && futureDays !== null
            ? moment().add(Number(futureDays), 'days').toDate()
            : undefined;

        this.dynamicValidationService.updateDateLimits(
          'policy_start_date',
          minDate,
          maxDate,
        );

        const machineryFormArray = this.quoteFormService.form.get(
          'machinery',
        ) as FormArray;
        if (this.premiumCalcRes.machinery && machineryFormArray) {
          this.premiumCalcRes.machinery.forEach(
            (machineryData: any, index: number) => {
              const machineryGroup = machineryFormArray.at(index) as FormGroup;
              if (machineryGroup) {
                const costControl = machineryGroup.get('cost_of_machinery_si');
                if (costControl) {
                  const newValidators = [Validators.required];
                  const minSiCap = machineryData.min_si_cap;
                  const maxSiCap = machineryData.max_si_cap;

                  const fieldKey = `machinery.${index}.cost_of_machinery_si`;

                  const min: number | undefined =
                    minSiCap !== null && minSiCap !== ''
                      ? Number(minSiCap)
                      : undefined;
                  const max: number | undefined =
                    maxSiCap !== null && maxSiCap !== ''
                      ? Number(maxSiCap)
                      : undefined;

                  this.dynamicValidationService.updateNumericLimits(
                    fieldKey,
                    min,
                    max,
                  );

                  if (min !== undefined) {
                    newValidators.push(UtilsService.minDynamic(min));
                  }
                  if (max !== undefined) {
                    newValidators.push(UtilsService.maxDynamic(max));
                  }

                  costControl.setValidators(newValidators);
                  costControl.updateValueAndValidity();
                  costControl.markAsTouched();
                }
              }
            },
          );
        }

        const policyStartDateControl =
          this.quoteFormService.form.get('policy_start_date');
        if (policyStartDateControl) {
          const newValidators = [Validators.required];

          if (minDate) {
            newValidators.push(UtilsService.minDateDynamic(minDate));
            policyStartDateControl.markAsTouched();
          }
          if (maxDate) {
            newValidators.push(UtilsService.maxDateDynamic(maxDate));
            policyStartDateControl.markAsTouched();
          }

          policyStartDateControl.setValidators(newValidators);
          policyStartDateControl.updateValueAndValidity();
        }
      } else {
        throw new Error('Error in Premium Calc API!!!');
      }
      return res;
    } catch (error) {
      throw error;
    }
  }

  async downloadQuote() {
    try {
      const url =
        this.api.url +
        `quote/data/${this.quoteRes?.quoteId}/quote.pdf/quote.pdf`;
      await this.api.httpGetMethod(url, { download: 1 });
    } catch (error) {
      console.error('Error in Download API: ', error);
    }
  }

  async clone(isClone: boolean = true) {
    try {
      const url = this.api.url + 'quote/clone';
      const payload = {
        quote_id: this.quoteRes?.quoteId || '',
        no_version: isClone ? '1' : '',
        master_policy_no: '',
      };
      const res = await this.api.httpPostMethod(url, payload);
      if (res?.['data']?.[0]) {
        this.quoteRes = this.quoteResService.adapt(res?.['data']?.[0]);
        this.setPolicyId = this.quoteRes?.policyId;
        this.router.navigate([`/quote/create-quote/${this.getPolicyId}`]);
      } else {
        throw new Error('Error in quote API!!!');
      }
    } catch (error) {
      console.log('Error in Clone API');
      throw error;
    }
  }
}
