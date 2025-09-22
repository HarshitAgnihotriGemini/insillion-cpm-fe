import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
import { CkycOffcanvasComponent } from '../shared/ckyc-offcanvas/ckyc-offcanvas.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ViewBreakupComponent } from '../shared/view-breakup/view-breakup.component';

@Component({
  selector: 'app-cpm-review-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, BreadcrumbComponent],
  templateUrl: './cpm-review-details.component.html',
})
export class CpmReviewDetailsComponent implements OnInit {
  bsModalRef?: BsModalRef;
  public config: any;
  private offcanvasService = inject(NgbOffcanvas);
  public isProposal = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    if (history.state && history.state.isProposal) {
      this.isProposal = true;
    }
    this.http.get<any>('/assets/cpm-policy-summary.json').subscribe((data) => {
      this.config = data;
    });
  }
  redirect() {
    this.router.navigate(['cpm-proposal']);
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
}
