import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
        await this.fetchProduct();
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

  redirect() {
    this.router.navigate(['/quote/review-quote'], {
      state: { isProposal: false },
    });
  }
}
