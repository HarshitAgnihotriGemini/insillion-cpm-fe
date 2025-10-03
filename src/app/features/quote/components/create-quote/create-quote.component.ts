import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from '@app/shared/common-components/breadcrumb/breadcrumb.component';
import { SectionComponent } from '@app/shared/common-components/section/section.component';
import { TermsAndConditionsModalComponent } from '@app/shared/common-components/terms-and-conditions/terms-and-conditions.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CoverageOffcanvasComponent } from '@app/shared/common-components/coverage-offcanvas/coverage-offcanvas.component';
import { ApiService } from '@app/shared/services/api.service';
import * as cpmQuote from '@app/shared/schemas/cpm-quote.json';
import { QuoteFormService } from '../../quote-form.service';
import { QuoteService } from '../../quote.service';
import moment from 'moment';
import { concatMap, firstValueFrom, forkJoin, from } from 'rxjs';
import { LoaderService } from '@app/shared/services/loader.service';
import { ViewBreakupComponent } from '@app/shared/common-components/view-breakup/view-breakup.component';
import { REVIEW_QUOTE } from '@app/shared/constants/routes';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-create-quote',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    SectionComponent,
    ViewBreakupComponent,
  ],
  templateUrl: './create-quote.component.html',
  styleUrl: './create-quote.component.scss',
})
export class CreateQuoteComponent implements OnInit {
  bsModalRef?: BsModalRef;
  config: any;
  form!: FormGroup;
  sectionState = new Map<string, boolean>();
  private readonly offcanvasService = inject(NgbOffcanvas);
  imgPath: string;
  isBreakupVisible = false;
  isGettingPremium = false;

  constructor(
    private readonly modalService: BsModalService,
    private readonly router: Router,
    private readonly _route: ActivatedRoute,
    private readonly apiService: ApiService,
    private readonly quoteFormService: QuoteFormService,
    private readonly quoteService: QuoteService,
    private readonly loaderService: LoaderService,
    private readonly toastr: ToastrService,
  ) {
    this.imgPath = this.imgPath = `${this.apiService.commonPath}/assets/`;
  }

  ngOnInit(): void {
    this.config = cpmQuote;
    this.form = this.quoteFormService.initializeForm();
    this.config?.sections?.forEach((section: any) => {
      this.sectionState.set(section.title, true);
    });
    this._route.params?.subscribe(async (params) => {
      try {
        this.quoteService.setPolicyId = params?.['id'];
        if (this.quoteService.getPolicyId !== 'new') {
          await this.quoteService.getDetailByPolicyId();
        }
        this.fetchBranchListAsync();
      } catch (error) {
        console.log('Error in Create quote: ' + error);
      }
    });
  }

  private async fetchBranchListAsync(): Promise<void> {
    await this.quoteService.fetchBranchList();
  }

  openTermsModal() {
    const initialState = {
      items: this.config.modals.termsAndConditions,
      title: 'Special Conditions, Warranties & Exclusions',
    };
    this.bsModalRef = this.modalService.show(TermsAndConditionsModalComponent, {
      initialState,
      class: 'modal-lg',
    });
  }

  openCoverageOffcanvas(): void {
    const offCanvasConfig = this.config.offCanvasConfigs.addCovers;
    const offcanvasRef = this.offcanvasService.open(
      CoverageOffcanvasComponent,
      { position: 'end', panelClass: 'offcanvas-width-40' },
    );
    offcanvasRef.componentInstance.config = offCanvasConfig;
  }
  handleButtonClick(field: any): void {
    if (field.action === 'addCovers') {
      this.openCoverageOffcanvas();
    }
  }

  handleFieldEvent(event: { action: string; payload: any }) {
    const { target, fieldKey } = event.payload;
    const value = target.value;
    if (event.action === 'validateIntermediary') {
      this.validateIntermediary(value, fieldKey);
    } else if (event.action === 'onPropositionChange') {
      this.onPropositionChange(value);
    } else if (event.action === 'onTransactionTypeChange') {
      this.onTransactionTypeChange(value);
    } else if (event.action === 'onPolicyStartDateChange') {
      this.onPolicyStartDateChange(value);
    } else if (event.action === 'fetchLocationDetails') {
      this.fetchLocationDetails(value, fieldKey);
    }
  }

  async validateIntermediary(imdValue: string, fieldKey: string) {
    this.loaderService.showLoader(fieldKey);
    try {
      if (imdValue) {
        const propositionRes =
          await this.quoteService.fetchPropositionData(imdValue);

        this.form.controls['propositionSelection'].setValue(
          propositionRes?.data[0],
        );
        await this.onPropositionChange(
          this.form.controls['propositionSelection'].value,
        );
      }
    } catch (error) {
      console.error('Error validating intermediary:', error);
    } finally {
      this.loaderService.hideLoader(fieldKey);
    }
  }

  async onPropositionChange(propositionName: string) {
    try {
      if (propositionName) {
        const transactionTypeRes =
          await this.quoteService.getTransactionTypes(propositionName);
        this.form.controls['policy_transaction_type'].setValue(
          transactionTypeRes[0],
        );
        this.onTransactionTypeChange(
          this.form.controls['policy_transaction_type'].value,
        );
      }
    } catch (error) {
      console.error('Error fetching transaction types:', error);
    }
  }

  async fetchProduct() {
    try {
      if (
        this.form.controls['propositionSelection'].value &&
        this.form.controls['policy_transaction_type'].value
      ) {
        const payload = {
          proposition_name: this.form.controls['propositionSelection'].value,
          settings_name: 'product',
          biz_type: this.form.controls['policy_transaction_type'].value,
        };
        const productNameRes =
          await this.quoteService.fetchProductName(payload);
        this.form.controls['product'].setValue(productNameRes[0]);
      }
    } catch (error) {
      console.error('Error fetching transaction types:', error);
    }
  }

  async fetchPackagePlan() {
    try {
      if (this.form.controls['product'].value) {
        const payload = {
          proposition: this.form.controls['propositionSelection'].value,
          product: this.form.controls['product'].value,
          policy_transaction_type:
            this.form.controls['policy_transaction_type'].value,
          skip: '/v1/rater/',
        };
        await this.quoteService.fetchPackagePlan(payload);
      }
    } catch (error) {
      console.error('Error fetching package plan:', error);
    }
  }

  async onTransactionTypeChange(transactionType: string) {
    if (!transactionType) return;
    const fieldKey = 'policy_transaction_type';
    this.loaderService.showLoader(fieldKey);
    try {
      const proposition = this.form.controls['propositionSelection'].value;
      await firstValueFrom(
        forkJoin([
          from(this.fetchProduct()).pipe(
            concatMap(() => from(this.fetchPackagePlan())),
          ),
          from(this.quoteService.fetchMachineryTypes()),
          from(this.quoteService.fetchVoluntaryExcess()),
          from(
            this.quoteService.fetchFloaterCoverage(
              proposition,
              transactionType,
            ),
          ),
        ]),
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      this.loaderService.hideLoader(fieldKey);
    }
  }

  async fetchLocationDetails(pincode: string, fieldKey: string) {
    this.loaderService.showLoader(fieldKey);
    try {
      if (pincode && pincode.length === 6) {
        const locationRes =
          await this.quoteService.fetchLocationDetails(pincode);
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    } finally {
      this.loaderService.hideLoader(fieldKey);
    }
  }

  onPolicyStartDateChange(date: string) {
    if (date) {
      const startDate = moment(date);
      const endDate = startDate.add(1, 'year').subtract(1, 'day');
      this.form.controls['policy_end_date'].setValue(
        endDate.format('DD/MM/YYYY'),
      );
    }
  }

  async getQuote() {
    this.isGettingPremium = true;
    try {
      if (this.form.valid) {
        await this.quoteService.saveQuote();
        this.isBreakupVisible = true;
      } else {
        this.toastr.error('Form is not valid');
        console.error('Form is invalid:', this.form);
      }
    } catch (error) {
      console.error('Error in get quote:', error);
    } finally {
      this.isGettingPremium = false;
    }
  }

  redirect() {
    this.router.navigate(
      [`/quote/${REVIEW_QUOTE}/${this.quoteService.getPolicyId}`],
      {
        state: { isProposal: false },
      },
    );
  }
}
