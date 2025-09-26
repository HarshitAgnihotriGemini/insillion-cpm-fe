import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private fb: FormBuilder) {}

  createFormGroup(sections: any[]): FormGroup {
    const group = this.fb.group({});
    sections.forEach((section) => {
      section.subsections?.forEach((subsection: any) => {
        if (subsection.type === 'form-array') {
          group.addControl(subsection.name, this.fb.array([]));
        } else {
          subsection.fields?.forEach((field: any) => {
            const validators = this.buildValidators(field.validators || {});
            group.addControl(
              field.name,
              this.fb.control(field.value ?? null, validators),
            );
          });
        }
      });
    });
    return group;
  }

  buildValidators(validators: any): ValidatorFn[] {
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

  getFormArray(form: FormGroup, name: string): FormArray {
    return form.get(name) as FormArray;
  }

  addGroup(form: FormGroup, subsection: any): void {
    const formArray = this.getFormArray(form, subsection.name);
    const newGroup = this.fb.group({});
    subsection.formGroupTemplate.forEach((field: any) => {
      const validators = this.buildValidators(field.validators || {});
      newGroup.addControl(
        field.name,
        this.fb.control(field.value || '', validators),
      );
    });
    formArray.push(newGroup);
  }

  removeGroup(form: FormGroup, subsectionName: string, index: number): void {
    this.getFormArray(form, subsectionName).removeAt(index);
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }
}
