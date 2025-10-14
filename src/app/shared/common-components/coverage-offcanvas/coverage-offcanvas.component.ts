import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '@app/shared/services/api.service';
import { QuoteFormService } from '@app/features/quote/quote-form.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { QuoteService } from '@app/features/quote/quote.service';
import { ErrorPopupService } from '@app/shared/services/error-popup.service';

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

  constructor(
    private readonly apiService: ApiService,
    private readonly quoteFormService: QuoteFormService,
    private readonly quoteService: QuoteService,
    private readonly errorPopupService: ErrorPopupService,
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
    this.form = this.quoteFormService.form;
  }

  ngOnInit(): void {
    this.config.fields.forEach((field: any) => {
      field._visible = this.quoteFormService.shouldShowField(field.name);
    });
    this.initPremiumCalcOnLoad();
  }

  async onCoverageChange() {
    try {
      await this.quoteService.premiumCalc();
      this.initPremiumCalcOnLoad();
    } catch (error: any) {
      this.errorPopupService.showErrorPopup(error.message);
    }
  }

  initPremiumCalcOnLoad(): void {
    try {
      const res = this.quoteService.premiumCalcRes;
      if (
        res?.machinery[0]?.type_machinery?.toLowerCase() ==
        'concrete pumping plant'
      ) {
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
      console.error('Error processing premium calculation result:', error);
    }
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

  searchCovers(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.config.fields.forEach((field: any) => {
      const initialVisibility = this.quoteFormService.shouldShowField(
        field.name,
      ); // Assuming shouldShowField is public in service
      const matchesSearch = field.label.toLowerCase().includes(searchText);
      field._visible = matchesSearch && initialVisibility;
    });
  }
}
