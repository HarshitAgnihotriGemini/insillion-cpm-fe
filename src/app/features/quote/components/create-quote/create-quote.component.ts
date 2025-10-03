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

@Component({
  standalone: true,
  selector: 'app-create-quote',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    SectionComponent,
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
  constructor(
    private readonly modalService: BsModalService,
    private readonly router: Router,
    private readonly _route: ActivatedRoute,
    private readonly apiService: ApiService,
    private readonly quoteFormService: QuoteFormService,
    private readonly quoteService: QuoteService,
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
    if (event.action === 'validateIntermediary') {
      this.validateIntermediary(event.payload.target.value);
    } else if (event.action === 'onPropositionChange') {
      this.onPropositionChange(event.payload.target.value);
    } else if (event.action === 'onTransactionTypeChange') {
      this.onTransactionTypeChange(event.payload.target.value);
    } else if (event.action === 'onPolicyStartDateChange') {
      this.onPolicyStartDateChange(event.payload.target.value);
    } else if (event.action === 'fetchLocationDetails') {
      this.fetchLocationDetails(event.payload.target.value);
    }
  }

  async validateIntermediary(imdValue: string) {
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

    try {
      await firstValueFrom(
        forkJoin([
          from(this.fetchProduct()).pipe(
            concatMap(() => from(this.fetchPackagePlan())),
          ),
          from(this.quoteService.fetchMachineryTypes()),
          from(this.quoteService.fetchVoluntaryExcess()),
        ]),
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async fetchLocationDetails(pincode: string) {
    try {
      if (pincode && pincode.length === 6) {
        const locationRes =
          await this.quoteService.fetchLocationDetails(pincode);
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
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
    try {
      if (this.form.valid) {
        await this.quoteService.saveQuote();
      } else {
        console.error('Form is invalid:', this.form);
      }
    } catch (error) {
      console.error('Error in get quote:', error);
    }
  }

  redirect() {
    this.router.navigate(['/quote/review-quote'], {
      state: { isProposal: false },
    });
  }
}
