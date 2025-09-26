import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '@app/shared/common-components/breadcrumb/breadcrumb.component';
import { SectionComponent } from '@app/shared/common-components/section/section.component';
import { TermsAndConditionsModalComponent } from '@app/shared/common-components/terms-and-conditions/terms-and-conditions.component';
import { FormService } from '@app/shared/services/form.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CoverageOffcanvasComponent } from '@app/shared/common-components/coverage-offcanvas/coverage-offcanvas.component';
import { ApiService } from '@app/shared/services/api.service';
import * as cpmQuote from '@app/shared/schemas/cpm-quote.json';
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
export class CreateQuoteComponent {
  bsModalRef?: BsModalRef;
  config: any;
  form!: FormGroup;
  sectionState = new Map<string, boolean>();
  private offcanvasService = inject(NgbOffcanvas);
  imgPath: string;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private formService: FormService,
    private readonly apiService: ApiService
  ) {
    this.imgPath = this.imgPath = `${this.apiService.commonPath}/assets/`;
  }

  ngOnInit(): void {
    this.config = cpmQuote;
    this.form = this.formService.createFormGroup(this.config.sections);
    this.config?.sections?.forEach((section: any) => {
      this.sectionState.set(section.title, true);
    });
  }

  getFormArray(name: string): FormArray {
    return this.formService.getFormArray(this.form, name);
  }

  addGroup(subsection: any): void {
    this.formService.addGroup(this.form, subsection);
  }

  removeGroup(subsection: any, index: number): void {
    this.formService.removeGroup(this.form, subsection.name, index);
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return this.formService.getFormGroup(control);
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
  redirect() {
    this.router.navigate(['/quote/review-quote'], {
      state: { isProposal: false },
    });
  }
}
