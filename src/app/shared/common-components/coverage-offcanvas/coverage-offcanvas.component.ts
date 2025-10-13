import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { ApiService } from '@app/shared/services/api.service';
import { QuoteFormService } from '@app/features/quote/quote-form.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuoteService } from '@app/features/quote/quote.service';

@Component({
  selector: 'app-coverage-offcanvas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './coverage-offcanvas.component.html',
})
export class CoverageOffcanvasComponent implements OnInit {
  @Input() title: string = 'Coverage Options';
  @Input() config: any;
  form!: FormGroup;
  offcanvasService = inject(NgbOffcanvas);
  imgPath: string;
  proposition!: string;

  constructor(
    private readonly apiService: ApiService,
    private readonly quoteFormService: QuoteFormService,
    private readonly quoteService: QuoteService,
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
    this.form = this.quoteFormService.form;
  }
  ngOnInit(): void {
    this.setupFormControls();
    this.initPremiumCalc();
    this.proposition = this.form.get('proposition_name')?.value;

    this.config.fields.forEach((field: any) => {
      field._visible = this.shouldShowField(field.name);

      if (field.subFields) {
        field.subFields.forEach((subField: any) => {
          if (subField.name === 'addon_si') {
            subField._visible = this.shouldShowAddonSi(field.name);
          } else {
            subField._visible = true;
          }
        });
      }
    });

    this.setFieldRequired(
      'thirdPartyLiability',
      'addon_aoaaoy',
      this.proposition === 'Product',
    );
  }

  async initPremiumCalc() {
    try {
      await this.quoteService.premiumCalc();
      const res = this.quoteService.premiumCalcRes;
      if (res?.machinery[0]?.type_machinery.toLowerCase() == 'concrete pumping plant') {
        this.form.controls['thirdPartyLiability_checked'].setValue(true, {
          emitEvent: false,
        });
        this.form.controls['thirdPartyLiability_checked'].disable();
      }
      if (res?.iscreater == 0) {
        const thirdPartyLiability = this.form.get('thirdPartyLiability');
        if (thirdPartyLiability instanceof FormGroup) {
          const addonAoaaoyValue = thirdPartyLiability.get('addon_aoaaoy');
          if (addonAoaaoyValue) {
            addonAoaaoyValue.disable();
          }
        }
        this.config.fields.forEach((field: any) => {
          if (field.subFields) {
            const group = this.form.get(field.name) as FormGroup;
            if (group) {
              const addonSiControl = group.get('addon_si');
              if (addonSiControl) {
                addonSiControl.disable();
              }
            }
          }
        });
      }
    } catch (error) {
      console.error('Error calculating premium:', error);
    }
  }

  shouldShowField(fieldName: string): boolean {
    const proposition = this.proposition;
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

  shouldShowAddonSi(fieldName: string): boolean {
    if (
      fieldName === 'ownersSurroundingProperty' ||
      fieldName === 'thirdPartyLiability' ||
      fieldName === 'removalOfDebris'
    ) {
      return ['SF', 'AAR', 'RS SmartScale', 'BB', 'RA', 'Product'].includes(
        this.proposition,
      );
    }
    if (fieldName === 'airFreight' || fieldName === 'escalation') {
      return ['SF', 'AAR', 'Product'].includes(this.proposition);
    }
    if (
      fieldName === 'additionalCustomDuty' ||
      fieldName === 'expeditingExpenses'
    ) {
      return ['SF', 'Product'].includes(this.proposition);
    }
    if (fieldName === 'dismantlingCover') {
      return ['ABCDE'].includes(this.proposition);
    }
    if (fieldName === 'expressFreight') {
      return ['SF'].includes(this.proposition);
    }
    return true;
  }

  private setFieldRequired(
    fieldName: string,
    subFieldName: string,
    isRequired: boolean,
  ) {
    const fieldConfig = this.config.fields.find(
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

  private setupFormControls(): void {
    this.config.fields.forEach((field: any) => {
      if (!this.form.get(field.name + '_checked')) {
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
            this.initPremiumCalc();
          });
        } else {
          const control = new FormControl({
            value: isChecked,
            disabled: field.readonly || false,
          });
          this.form.addControl(field.name, control);
          control.valueChanges.subscribe(() => {
            this.initPremiumCalc();
          });
        }
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

    const parentField = this.config.fields.find(
      (f: any) => f.name === groupName,
    );
    const parentIsVisible = parentField ? parentField._visible !== false : true;

    subFields.forEach((subField) => {
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
  getFormGroup(control: AbstractControl | null) {
    return control as FormGroup;
  }

  getControl(name: string) {
    const control = this.form.get(name);
    if (control instanceof FormGroup) {
      return control.controls;
    }
    return {};
  }
}
