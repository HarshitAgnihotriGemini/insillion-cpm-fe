import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachmentsReviewComponent } from '@app/shared/common-components/attachments-review/attachments-review.component';
import { BreadcrumbComponent } from '@app/shared/common-components/breadcrumb/breadcrumb.component';
import { CkycOffcanvasComponent } from '@app/shared/common-components/ckyc-offcanvas/ckyc-offcanvas.component';
import { PolicySummaryComponent } from '@app/shared/common-components/policy-summary/policy-summary.component';
import { ViewBreakupComponent } from '@app/shared/common-components/view-breakup/view-breakup.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import * as cpmReview from '@app/shared/schemas/cpm-policy-summary.json';
import { ApiService } from '@app/shared/services/api.service';
import { QuoteService } from '../../quote.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { QuoteFormService } from '../../quote-form.service';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormService } from '@app/shared/services/form.service';
import { SectionComponent } from '@app/shared/common-components/section/section.component';
import { DynamicOptionsService } from '@app/shared/services/dynamic-options.service';
import { TermsAndConditionsModalComponent } from '@app/shared/common-components/terms-and-conditions/terms-and-conditions.component';

@Component({
  selector: 'app-review-quote',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    PolicySummaryComponent,
    AttachmentsReviewComponent,
    ViewBreakupComponent,
    ReactiveFormsModule,
    SectionComponent,
  ],
  templateUrl: './review-quote.component.html',
  styleUrl: './review-quote.component.scss',
})
export class ReviewQuoteComponent implements OnInit {
  bsModalRef?: BsModalRef;
  form!: FormGroup;
  config: any;
  private readonly offcanvasService = inject(NgbOffcanvas);
  isProposal = false;
  isFinalized = false;
  isFinalizing = false;
  imgPath: string;
  policyNoteRes: any;
  constructor(
    private readonly router: Router,
    private readonly modalService: BsModalService,
    private readonly toastr: ToastrService,
    public readonly apiService: ApiService,
    private readonly _route: ActivatedRoute,
    public readonly quoteService: QuoteService,
    private readonly quoteFormService: QuoteFormService,
    private readonly location: Location,
    private readonly spinner: NgxSpinnerService,
    private readonly formService: FormService,
    private readonly dynamicOptionsService: DynamicOptionsService,
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
        this.spinner.show();
        this.quoteService.setPolicyId = params?.['id'];
        if (this.quoteService.getPolicyId !== 'new') {
          await this.quoteService.getDetailByPolicyId();
          if (this.quoteService.quoteRes?.nstp_flag) {
            this.policyNoteRes = await this.quoteService.policyNote();
          }
        }
        if (
          this.apiService?.role == 'underwriter' &&
          this.apiService?.email == this.quoteService?.quoteRes?.assigned_to
        ) {
          this.form = this.quoteFormService.initializeUWForm();
          this.setUwActions();
        }
      } catch (error) {
        console.log('Error in Create quote: ' + error);
      } finally {
        this.spinner.hide();
      }
    });
  }

  get isProposalAllow() {
    return (
      this.quoteService.quoteRes?.nstp_status === '' ||
      this.quoteService.quoteRes?.nstp_status?.toLowerCase() === 'approved'
    );
  }

  redirect() {
    this.router.navigate([
      `/proposal/create-proposal/${this.quoteService.getPolicyId}`,
    ]);
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
    if (field.action === 'uwSubmit') {
      this.uwSubmit();
    }
  }
  goBack() {
    this.location.back();
  }

  downloadQuote() {
    try {
      this.quoteService.downloadQuote();
    } catch (err) {
      console.error('Error in Download Functionality');
    }
  }

  async quoteVersioning() {
    try {
      await this.quoteService.clone(false);
    } catch (error) {
      console.error('Error in quote Versioning: ', error);
    }
  }

  async quoteClone() {
    try {
      await this.quoteService.clone();
    } catch (error) {
      console.error('Error in quote Versioning: ', error);
    }
  }

  async takeover() {
    try {
      this.spinner.show();
      await this.quoteService.claim();
      await this.quoteService.getDetailByPolicyId();
      this.policyNoteRes = await this.quoteService.policyNote();
      this.form = this.quoteFormService.initializeUWForm();
      this.setUwActions();
    } catch (error: any) {
      this.toastr.error(error, 'Failure!');
    } finally {
      this.spinner.hide();
    }
  }

  handleFieldEvent(event: { action: string; payload: any }) {
    const value = event.payload.target.value;
  }

  setUwActions() {
    const options = ['Reject', 'Send Back to Sales', 'Send Back to Group'];
    const policy = this.quoteService.quoteRes;
    if (!policy || !policy.data) {
      this.dynamicOptionsService.setOptions('uwActionOptions', options);
      return;
    }

    const isEngineeringOrLiability =
      policy.data.product_group_name === 'Engineering' ||
      policy.data.product_group_name === 'Liability';

    const canReview =
      isEngineeringOrLiability &&
      !policy.nstp_status &&
      policy.data.uw_review_branch_level !== '' &&
      policy.data.uw_review_branch_level !==
        policy.data.uw_approve_branch_level &&
      policy.data.uw_review_branch_level === policy.data.login_user_group;

    if (canReview) {
      options.unshift('Review');
    }

    const canApprove =
      isEngineeringOrLiability &&
      ((policy.nstp_status === 'reviewed' &&
        policy.data.uw_approve_branch_level === policy.data.login_user_group) ||
        (policy.data.uw_review_branch_level ===
          policy.data.uw_approve_branch_level &&
          policy.data.uw_approve_branch_level ===
            policy.data.login_user_group &&
          policy.data.uw_review_branch_level === policy.data.login_user_group));

    if (canApprove) {
      options.unshift('Approve');
    }

    this.dynamicOptionsService.setOptions('uwActionOptions', options);
  }

  async openTermsModal() {
      try {
        await this.quoteService.premiumCalc(undefined, false, this.quoteService.quoteRes.data);
        const initialState = {
          items: this.quoteService.quoteRes?.clause_wordings,
          title: 'Special Conditions, Warranties & Exclusions',
        };
        this.bsModalRef = this.modalService.show(
          TermsAndConditionsModalComponent,
          {
            initialState,
            class: 'modal-lg',
          },
        );
      } catch (error) {
        this.toastr.error(
          'Could not calculate premium. Please try again.',
          'Failure!',
        );
      }
  }

  async uwSubmit() {
    if (this.form.valid) {
      try {
        this.spinner.show();
        if (this.form.controls['uw_action'].value.toLowerCase() === 'approve') {
          await this.quoteService.nstpMessage('approved');
          this.toastr.success('Quote is approved successfully.', 'Success!');
        } else if (
          this.form.controls['uw_action'].value.toLowerCase() === 'review'
        ) {
          await this.quoteService.nstpMessage('reviewed');
          this.toastr.success('Quote is reviewed successfully.', 'Success!');
        } else if (
          this.form.controls['uw_action'].value.toLowerCase() === 'reject'
        ) {
          await this.quoteService.nstpMessage('rejected');
          this.toastr.success('Quote is rejected successfully.', 'Success!');
        } else if (
          this.form.controls['uw_action'].value.toLowerCase() ===
          'send back to sales'
        ) {
          await this.quoteService.postPolicyNote(
            this.quoteService?.quoteRes?.created_by,
          );
          await this.quoteService.nstpMessage('Query by UW');
          this.toastr.success('Sent back to sales successfully.', 'Success!');
        } else if (
          this.form.controls['uw_action'].value.toLowerCase() ===
          'send back to group'
        ) {
          await this.quoteService.postPolicyNote();
          this.toastr.success('Sent back to group successfully.', 'Success!');
        }
        await this.quoteService.getDetailByPolicyId();
        this.policyNoteRes = await this.quoteService.policyNote();
        this.form.reset();
      } catch (error: any) {
        this.toastr.error(error, 'Failure!');
      } finally {
        this.spinner.hide();
      }
    } else {
      this.toastr.error('Form is not valid', 'Failure!');
    }
  }
}
