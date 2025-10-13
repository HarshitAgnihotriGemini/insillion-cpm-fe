import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SectionComponent } from '@app/shared/common-components/section/section.component';
import { BreadcrumbComponent } from '@app/shared/common-components/breadcrumb/breadcrumb.component';
import * as cpmProposal from '@app/shared/schemas/cpm-proposal.json';
import { CommonModule } from '@angular/common';
import { ProposalFormService } from '../../proposal-form.service';
import { ProposalService } from '../../proposal.service';
import { Location } from '@angular/common';
import { ApiService } from '@app/shared/services/api.service';

@Component({
  selector: 'app-create-proposal',
  standalone: true,
  imports: [
    SectionComponent,
    BreadcrumbComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-proposal.component.html',
  styleUrl: './create-proposal.component.scss',
})
export class CreateProposalComponent implements OnInit {
  bsModalRef?: BsModalRef;
  config: any;
  form!: FormGroup;
  sectionState = new Map<string, boolean>();
  imgPath: string

  constructor(
    private readonly proposalFormService: ProposalFormService,
    private readonly proposalService: ProposalService,
    private readonly router: Router,
    private readonly location: Location,
    private readonly apiService: ApiService
  ) {
    this.imgPath = this.imgPath = `${this.apiService.commonPath}/assets/`;
  }

  ngOnInit(): void {
    this.config = cpmProposal;
    this.form = this.proposalFormService.initializeForm();
    this.config.sections.forEach((section: any) => {
      this.sectionState.set(section.title, true);
    });
  }

  redirect() {
    this.router.navigate(['cpm-review'], {
      state: { isProposal: true },
    });
  }
  goBack() {
    this.location.back(); 
  }
}