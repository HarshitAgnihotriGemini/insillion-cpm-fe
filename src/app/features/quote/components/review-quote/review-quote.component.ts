import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AttachmentsReviewComponent } from '@app/shared/common-components/attachments-review/attachments-review.component';
import { BreadcrumbComponent } from '@app/shared/common-components/breadcrumb/breadcrumb.component';
import { CkycOffcanvasComponent } from '@app/shared/common-components/ckyc-offcanvas/ckyc-offcanvas.component';
import { PolicySummaryComponent } from '@app/shared/common-components/policy-summary/policy-summary.component';
import { TotalPremiumComponent } from '@app/shared/common-components/total-premium/total-premium.component';
import { ViewBreakupComponent } from '@app/shared/common-components/view-breakup/view-breakup.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import * as cpmReview from '@app/shared/schemas/cpm-policy-summary.json';
import { ApiService } from '@app/shared/services/api.service';

@Component({
  selector: 'app-review-quote',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    BreadcrumbComponent,
    PolicySummaryComponent,
    AttachmentsReviewComponent,
    TotalPremiumComponent,
  ],
  templateUrl: './review-quote.component.html',
  styleUrl: './review-quote.component.scss',
})
export class ReviewQuoteComponent {
  bsModalRef?: BsModalRef;
  public config: any;
  private offcanvasService = inject(NgbOffcanvas);
  public isProposal = false;
  isFinalized = false;
  imgPath: string;
  constructor(
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private readonly apiService: ApiService,
  ) {
    this.imgPath = this.imgPath = `${this.apiService.commonPath}/assets/`;
  }

  ngOnInit(): void {
    if (history.state && history.state.isProposal) {
      this.isProposal = true;
    }
    this.config = cpmReview;
  }
  redirect() {
    this.router.navigate(['/proposal']);
  }
  openCKycOffcanvas(): void {
    this.offcanvasService.open(CkycOffcanvasComponent, {
      position: 'end',
      panelClass: 'offcanvas-width-50',
    });
  }
  viewBreakup() {
    const initialState = {
      config: this.config.modals.premiumSummary,
    };
    this.bsModalRef = this.modalService.show(ViewBreakupComponent, {
      initialState,
      class: 'modal-md',
    });
  }
  handleButtonClick(field: any): void {
    if (field.action === 'ckycOffCanvas') {
      this.openCKycOffcanvas();
    }
  }

  handleFinalizeClick(): void {
    if (this.isFinalized) {
      window.location.href = 'http://localhost:8902';
    } else {
      this.toastr.success('The proposal has been submitted successfully');
      this.isFinalized = true;
    }
  }
}
