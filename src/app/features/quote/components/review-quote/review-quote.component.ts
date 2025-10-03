import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { environment } from 'environments/environment';
import { QuoteService } from '../../quote.service';

@Component({
  selector: 'app-review-quote',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    PolicySummaryComponent,
    AttachmentsReviewComponent,
    TotalPremiumComponent,
  ],
  templateUrl: './review-quote.component.html',
  styleUrl: './review-quote.component.scss',
})
export class ReviewQuoteComponent implements OnInit {
  bsModalRef?: BsModalRef;
  config: any;
  private readonly offcanvasService = inject(NgbOffcanvas);
  isProposal = false;
  isFinalized = false;
  imgPath: string;
  constructor(
    private readonly router: Router,
    private readonly modalService: BsModalService,
    private readonly toastr: ToastrService,
    private readonly apiService: ApiService,
    private readonly _route: ActivatedRoute,
    public readonly quoteService: QuoteService,
  ) {
    this.imgPath = this.imgPath = `${this.apiService.commonPath}/assets/`;
  }

  ngOnInit(): void {
    if (history.state?.isProposal) {
      this.isProposal = true;
    }
    this.config = cpmReview;
    this._route.params?.subscribe(async (params) => {
      try {
        this.quoteService.setPolicyId = params?.['id'];
        if (this.quoteService.getPolicyId !== 'new') {
          await this.quoteService.getDetailByPolicyId();
          console.log('111111', this.quoteService.quoteRes);
        }
      } catch (error) {
        console.log('Error in Create quote: ' + error);
      }
    });
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
      window.location.href = environment.paymentGatewayUrl;
    } else {
      this.toastr.success('The proposal has been submitted successfully');
      this.isFinalized = true;
    }
  }
}
