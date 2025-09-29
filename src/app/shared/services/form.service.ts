import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { REGEX_PATTERNS } from '../constants/regex.constants';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private readonly fb: FormBuilder) {}

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
              this.fb.control(field.value ?? null, validators)
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
        case 'pattern':
          if (REGEX_PATTERNS[value as keyof typeof REGEX_PATTERNS]) {
            validatorFns.push(
              Validators.pattern(
                REGEX_PATTERNS[value as keyof typeof REGEX_PATTERNS]
              )
            );
          } else {
            validatorFns.push(Validators.pattern(value));
          }
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
        this.fb.control(field.value || '', validators)
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

  setupConditionalLogic(form: FormGroup, sections: any[]): void {
    const allFields = sections
      .flatMap((s) => s.subsections || [])
      .flatMap((ss) =>
        ss.type === 'form-array' ? ss.formGroupTemplate : ss.fields || []
      );

    allFields.forEach((field) => {
      if (field) {
        // Set initial visibility
        field._visible = !field.visibleWhen;

        const applyLogic = () => {
          // Conditional Visibility
          if (field.visibleWhen) {
            const targetControl = form.get(field.visibleWhen.field);
            if (targetControl) {
              field._visible = targetControl.value === field.visibleWhen.value;
            }
          }

          // Conditional Validators
          if (field.validatorsWhen) {
            const control = form.get(field.name);
            if (control) {
              let newValidators: ValidatorFn[] = this.buildValidators(
                field.validators || {}
              );
              field.validatorsWhen.forEach((valWhen: any) => {
                const targetControl = form.get(valWhen.condition.field);
                if (
                  targetControl &&
                  targetControl.value === valWhen.condition.value
                ) {
                  newValidators = [
                    ...newValidators,
                    ...this.buildValidators(valWhen.validators),
                  ];
                }
              });
              control.setValidators(newValidators);
              control.updateValueAndValidity();
            }
          }
        };

        // Subscribe to dependencies
        const dependencies = new Set<string>();
        if (field.visibleWhen) {
          dependencies.add(field.visibleWhen.field);
        }
        if (field.validatorsWhen) {
          field.validatorsWhen.forEach((v: any) =>
            dependencies.add(v.condition.field)
          );
        }

        dependencies.forEach((depName) => {
          const targetControl = form.get(depName);
          if (targetControl) {
            targetControl.valueChanges.subscribe(() => applyLogic());
          }
        });

        // Apply initial logic
        applyLogic();
      }
    });
  }
}
