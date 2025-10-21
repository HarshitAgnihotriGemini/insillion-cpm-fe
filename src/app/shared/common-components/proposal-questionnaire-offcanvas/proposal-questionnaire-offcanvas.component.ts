import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '@app/shared/services/api.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProposalFormService } from '@app/features/proposal/proposal-form.service';

@Component({
  selector: 'app-proposal-questionnaire-offcanvas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './proposal-questionnaire-offcanvas.component.html',
})
export class ProposalQuestionnaireOffcanvasComponent implements OnInit {
  @Input() title: string = 'Proposal Questionnaire';
  @Input() config: any;
  @Input() form!: FormGroup;
  offcanvasService = inject(NgbOffcanvas);
  imgPath: string;

  constructor(
    private readonly apiService: ApiService,
    private readonly proposalFormService: ProposalFormService
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
  }

  ngOnInit(): void {
    this.config.fields.forEach((field: any) => {
      field._visible = true; // Initially all fields are visible
      if (field.subFields) {
        this.toggleSubfields(field.name, this.form.get(field.name)?.value);
      }
    });
  }

  toggleSubfields(fieldName: string, isChecked: boolean): void {
    const subFieldsGroup = this.form.get(fieldName + '_group') as FormGroup;
    if (subFieldsGroup) {
      const field = this.config.fields.find((f: any) => f.name === fieldName);
      if (isChecked) {
        subFieldsGroup.enable();
      } else {
        subFieldsGroup.disable();
        subFieldsGroup.reset();
      }
      for (const controlName in subFieldsGroup.controls) {
        if (isChecked) {
          subFieldsGroup.controls[controlName].setValidators([
            Validators.required,
          ]);
        } else {
          subFieldsGroup.controls[controlName].clearValidators();
        }
        subFieldsGroup.controls[controlName].updateValueAndValidity();
      }
      if (field && field.subFields) {
        field.subFields.forEach((sf: any) => sf._required = isChecked);
      }
    }
  }

  onCheckboxChange(event: any, fieldName: string) {
    this.toggleSubfields(fieldName, event.target.checked);
  }

  getFormGroup(control: AbstractControl | null) {
    return control as FormGroup;
  }

  getControl(name: string) {
    const control = this.form.get(name + '_group');
    if (control instanceof FormGroup) {
      return control.controls;
    }
    return {};
  }

  searchQuestions(event: Event): void {
    const searchText = (event.target as HTMLInputElement).value.toLowerCase();
    this.config.fields.forEach((field: any) => {
      const matchesSearch = field.label.toLowerCase().includes(searchText);
      field._visible = matchesSearch;
    });
  }
}
