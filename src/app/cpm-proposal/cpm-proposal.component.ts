import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb.component';
import { SectionComponent } from '../components/section/section.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cpm-proposal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BreadcrumbComponent,
    SectionComponent,
  ],
  templateUrl: './cpm-proposal.component.html',
  styleUrl: './cpm-proposal.component.scss',
})
export class CpmProposalComponent implements OnInit {
  config: any;
  form!: FormGroup;
  sectionState = new Map<string, boolean>();

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<any>('/assets/cpm-proposal-config.json').subscribe((data) => {
      this.config = data;
      this.form = this.createFormGroup();

      // MOVED: This logic now runs only AFTER the config data has loaded
      this.config.sections.forEach((section: any) => {
        this.sectionState.set(section.title, true);
      });
    });
  }

  createFormGroup(): FormGroup {
    const group = this.fb.group({});
    this.config.sections.forEach((section: any) => {
      section.subsections?.forEach((subsection: any) => {
        if (subsection.type === 'form-array') {
          group.addControl(subsection.name, this.fb.array([]));
        } else {
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
  redirect() {
    this.router.navigate(['cpm-review'], {
      state: { isProposal: true },
    });
  }
}
