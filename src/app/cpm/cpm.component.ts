import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { SectionComponent } from '../components/section/section.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TermsAndConditionsModalComponent } from '../components/terms-and-conditions/terms-and-conditions.component';
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CoverageOffcanvasComponent } from '../shared/coverage-offcanvas/coverage-offcanvas.component';
import { ViewBreakupComponent } from '../shared/view-breakup/view-breakup.component';

@Component({
  selector: 'app-cpm',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BreadcrumbComponent,
    SectionComponent,
  ],
  templateUrl: './cpm.component.html',
  styleUrl: './cpm.component.scss',
})
export class CpmComponent implements OnInit {
  bsModalRef?: BsModalRef;
  config: any;
  form!: FormGroup;
  sectionState = new Map<string, boolean>();
  private offcanvasService = inject(NgbOffcanvas);
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router
  ) {}
  // in your component.ts file (e.g., cpm.component.ts)

  ngOnInit(): void {
    this.http.get<any>('/assets/cpm-quote.json').subscribe((data) => {
      this.config = data;
      this.form = this.createFormGroup();
    });
    this.config?.sections?.forEach((section: any) => {
      this.sectionState.set(section.title, true);
    });
  }
  private buildValidators(validators: any): ValidatorFn[] {
    const validatorFns: ValidatorFn[] = [];
    for (const key in validators) {
      const value = validators[key];
      switch (key) {
        case 'required':
          if (value) validatorFns.push(Validators.required);
          break;
        case 'requiredTrue':
          if (value) validatorFns.push(Validators.requiredTrue);
          break;
        case 'minLength':
          validatorFns.push(Validators.minLength(value));
          break;
        case 'maxLength':
          validatorFns.push(Validators.maxLength(value));
          break;
        case 'min':
          validatorFns.push(Validators.min(value));
          break;
        case 'max':
          validatorFns.push(Validators.max(value));
          break;
        case 'email':
          if (value) validatorFns.push(Validators.email);
          break;
        case 'pattern':
          validatorFns.push(Validators.pattern(value));
          break;
      }
    }
    return validatorFns;
  }

  // NEW: Method to create the FormGroup from the config
  // in your cpm.component.ts
  createFormGroup(): FormGroup {
    const group = this.fb.group({});

    this.config.sections.forEach((section: any) => {
      section.subsections?.forEach((subsection: any) => {
        // If the subsection is a form-array, create a FormArray for it
        if (subsection.type === 'form-array') {
          group.addControl(subsection.name, this.fb.array([]));
        }
        // Otherwise, create FormControls for its fields
        else {
          subsection.fields?.forEach((field: any) => {
            const validators = this.buildValidators(field.validators || {});
            group.addControl(
              field.name,
              this.fb.control(field.value ?? null, validators)
            );
          });
        }
      });
    });

    return group;
  }

  getFormArray(name: string): FormArray {
    return this.form.get(name) as FormArray;
  }

  addGroup(subsection: any): void {
    const formArray = this.getFormArray(subsection.name);
    const newGroup = this.fb.group({});
    subsection.formGroupTemplate.forEach((field: any) => {
      const validators = this.buildValidators(field.validators || {});
      newGroup.addControl(
        field.name,
        this.fb.control(field.value || '', validators)
      );
    });
    formArray.push(newGroup);
  }

  removeGroup(subsection: any, index: number): void {
    this.getFormArray(subsection.name).removeAt(index);
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
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

  viewBreakup() {
    const initialState = {
      config: this.config.modals.premiumSummary,
    };
    this.bsModalRef = this.modalService.show(ViewBreakupComponent, {
      initialState,
      class: 'modal-md',
    });
  }
  openCoverageOffcanvas(): void {
    const offCanvasConfig = this.config.offCanvasConfigs.addCovers;
    const offcanvasRef = this.offcanvasService.open(
      CoverageOffcanvasComponent,
      { position: 'end', panelClass: 'offcanvas-width-40' }
    );
    offcanvasRef.componentInstance.config = offCanvasConfig;
  }
  handleButtonClick(field: any): void {
    if (field.action === 'addCovers') {
      this.openCoverageOffcanvas();
    }
  }
  redirect() {
    this.router.navigate(['cpm-review'], {
      state: { isProposal: false },
    });
  }
}
