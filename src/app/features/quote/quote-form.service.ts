import { Injectable, Injector } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';
import * as cpmQuote from '@app/shared/schemas/cpm-quote.json';
import { QuoteService } from './quote.service';

@Injectable({
  providedIn: 'root',
})
export class QuoteFormService {
  public form!: FormGroup;
  private coversConfig: any;
  private _quoteService!: QuoteService;

  constructor(
    private readonly formService: FormService,
    private readonly injector: Injector,
  ) {}

  private get quoteService(): QuoteService {
    if (!this._quoteService) {
      this._quoteService = this.injector.get(QuoteService);
    }
    return this._quoteService;
  }

  initializeForm(): FormGroup {
    this.form = this.formService.createFormGroup(cpmQuote.sections);
    this.formService.setupConditionalLogic(this.form, cpmQuote.sections);
    this.initializeCoverControls(cpmQuote.offCanvasConfigs);

    this.form
      .get('proposition_name')
      ?.valueChanges.subscribe((propositionName) => {
        this.setFieldRequired(
          'thirdPartyLiability',
          'addon_aoaaoy',
          propositionName === 'Product',
        );
        const thirdPartyLiabilityField = this.coversConfig.fields.find(
          (f: any) => f.name === 'thirdPartyLiability',
        );
        if (thirdPartyLiabilityField && thirdPartyLiabilityField.subFields) {
          this.toggleSubFields(
            this.form.get('thirdPartyLiability_checked')?.value,
            'thirdPartyLiability',
            thirdPartyLiabilityField.subFields,
          );
        }
      });

    return this.form;
  }

  private initializeCoverControls(config: any): void {
    this.coversConfig = config;
    this.coversConfig.fields.forEach((field: any) => {
      if (
        !this.form.get(field.name + '_checked') &&
        !this.form.get(field.name)
      ) {
        let isChecked = field.checked || false;
        let addonData: any = null;

        if (
          this.quoteService.getPolicyId !== 'new' &&
          this.quoteService.quoteRes?.data?.location_addon
        ) {
          addonData = this.quoteService.quoteRes?.data?.location_addon.find(
            (addon: any) => addon.location_addon_name === field.label,
          );
          if (addonData) {
            isChecked = addonData.location_addon_opted === 'Yes';
          }
        }

        if (field.subFields) {
          const checkedControl = new FormControl(isChecked);
          this.form.addControl(field.name + '_checked', checkedControl);

          const group = new FormGroup({});
          field.subFields.forEach((dependentField: any) => {
            let value = dependentField.value || null;
            if (addonData) {
              value = addonData[dependentField.name];
            }
            const control = new FormControl({
              value: value,
              disabled: dependentField.readonly || false,
            });
            group.addControl(dependentField.name, control);
          });
          this.form.addControl(field.name, group);

          checkedControl.valueChanges.subscribe((isChecked) => {
            this.toggleSubFields(isChecked, field.name, field.subFields);
          });
        } else {
          const control = new FormControl({
            value: isChecked,
            disabled: field.readonly || false,
          });
          this.form.addControl(field.name, control);
        }
      }
    });

    this.coversConfig.fields.forEach((field: any) => {
      field._visible = this.shouldShowField(field.name);
      if (field.subFields) {
        field.subFields.forEach((subField: any) => {
          if (subField.name === 'addon_si') {
            subField._visible = this.shouldShowAddonSi(field.name);
          } else {
            subField._visible = true;
          }
        });
        this.toggleSubFields(
          this.form.get(field.name + '_checked')?.value,
          field.name,
          field.subFields,
        );
      }
    });
  }

  private toggleSubFields(
    isEnabled: boolean,
    groupName: string,
    subFields: any[],
  ) {
    const group = this.form.get(groupName) as FormGroup;
    if (!group) return;

    const parentField = this.coversConfig.fields.find(
      (f: any) => f.name === groupName,
    );
    const parentIsVisible = parentField ? parentField._visible !== false : true;

    subFields.forEach((subField) => {
      if (subField.name === 'addon_si') {
        subField._visible = this.shouldShowAddonSi(groupName);
      }

      const control = group.get(subField.name);
      if (control) {
        const isVisible = subField._visible !== false;
        const finalIsEnabled = isEnabled && parentIsVisible && isVisible;

        const validators = subField.validators?.required
          ? [Validators.required]
          : [];
        finalIsEnabled
          ? control.setValidators(validators)
          : control.clearValidators();
        if (subField.readonly) {
          control.disable();
        } else {
          finalIsEnabled ? control.enable() : control.disable();
        }
        control.updateValueAndValidity();
      }
    });
  }

  public setFieldRequired(
    fieldName: string,
    subFieldName: string,
    isRequired: boolean,
  ) {
    const fieldConfig = this.coversConfig.fields.find(
      (field: any) => field.name === fieldName,
    );
    if (fieldConfig && fieldConfig.subFields) {
      const subFieldConfig = fieldConfig.subFields.find(
        (subField: any) => subField.name === subFieldName,
      );
      if (subFieldConfig) {
        if (isRequired) {
          if (!subFieldConfig.validators) {
            subFieldConfig.validators = {};
          }
          subFieldConfig.validators.required = true;
        } else {
          if (subFieldConfig.validators) {
            delete subFieldConfig.validators.required;
          }
        }
      }
    }

    const formGroup = this.form.get(fieldName);
    if (formGroup instanceof FormGroup) {
      const control = formGroup.get(subFieldName);
      if (control) {
        if (isRequired) {
          control.setValidators([Validators.required]);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
    }
  }

  public shouldShowField(fieldName: string): boolean {
    const proposition = this.form.get('proposition_name')?.value;
    const product = this.form.get('product')?.value;

    if (fieldName === 'airFreight' || fieldName === 'expressFreight') {
      const condition1 =
        ['Toyota', 'Schwing Stetter', 'Wirtgen'].includes(proposition) &&
        product === 'CPM Comprehensive Cover';
      const condition2 = ['Product', 'Xperitus'].includes(proposition);
      return condition1 || condition2;
    }

    if (fieldName === 'escalation') {
      const condition1 =
        ['Toyota', 'Schwing Stetter', 'Wirtgen'].includes(proposition) &&
        product === 'CPM Comprehensive Cover';
      const condition2 = ['Product', 'Xperitus', 'RS SmartScale'].includes(
        proposition,
      );
      return condition1 || condition2;
    }

    if (
      fieldName === 'additionalCustomDuty' ||
      fieldName === 'expeditingExpenses'
    ) {
      const condition1 =
        ['Toyota', 'Schwing Stetter', 'Wirtgen'].includes(proposition) &&
        product === 'CPM Comprehensive Cover';
      const condition2 = proposition === 'Product';
      return condition1 || condition2;
    }

    if (fieldName === 'removalOfDebris') {
      return [
        'SF',
        'AAR',
        'Product',
        'RS SmartScale',
        'BB',
        'RA',
        'Xperitus',
      ].includes(proposition);
    }

    if (fieldName === 'dismantlingCover') {
      return ['SF', 'AAR', 'Product', 'RS SmartScale', 'BB', 'RA'].includes(
        proposition,
      );
    }
    if (fieldName === 'transitRisk') {
      return ['Product'].includes(proposition);
    }
    if (fieldName === 'mbCover') {
      return (
        ['Product'].includes(proposition) &&
        this.quoteService?.premiumCalcRes?.machinery[0]?.type_machinery?.toLowerCase() ==
          'tunnel boring machines'
      );
    }
    return true;
  }

  private shouldShowAddonSi(fieldName: string): boolean {
    const proposition = this.form.get('proposition_name')?.value;
    if (
      fieldName === 'ownersSurroundingProperty' ||
      fieldName === 'thirdPartyLiability' ||
      fieldName === 'removalOfDebris'
    ) {
      return ['SF', 'AAR', 'RS SmartScale', 'BB', 'RA', 'Product'].includes(
        proposition,
      );
    }
    if (fieldName === 'airFreight' || fieldName === 'escalation') {
      return ['SF', 'AAR', 'Product'].includes(proposition);
    }
    if (
      fieldName === 'additionalCustomDuty' ||
      fieldName === 'expeditingExpenses'
    ) {
      return ['SF', 'Product'].includes(proposition);
    }
    if (fieldName === 'dismantlingCover') {
      return ['ABCDE'].includes(proposition);
    }
    if (fieldName === 'expressFreight') {
      return ['SF'].includes(proposition);
    }
    return true;
  }
}
