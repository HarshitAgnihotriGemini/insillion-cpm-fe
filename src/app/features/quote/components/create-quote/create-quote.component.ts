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
import { DynamicOptionsService } from '@app/shared/services/dynamic-options.service';

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
    private readonly dynamicOptionsService: DynamicOptionsService
  ) {
    this.imgPath = this.imgPath = `${this.apiService.commonPath}/assets/`;
  }

  ngOnInit(): void {
    this.config = cpmQuote;
    this.form = this.quoteFormService.initializeForm();
    this.config?.sections?.forEach((section: any) => {
      this.sectionState.set(section.title, true);
    });

    // Simulate API call
    setTimeout(() => {
      const productOptions = [
        { key: 'product1', name: 'Product 1' },
        { key: 'product2', name: 'Product 2' },
        { key: 'product3', name: 'Product 3' },
      ];
      this.dynamicOptionsService.setOptions('productOptions', productOptions);
    }, 1000);
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
      console.log('even handler works');
    }
  }

  redirect() {
    this.router.navigate(['/quote/review-quote'], {
      state: { isProposal: false },
    });
  }
}
