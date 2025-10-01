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
            const validators = this.buildValidators(field.validators);
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
    if (validators) {
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
    }
    return validatorFns;
  }

  getFormArray(form: FormGroup, name: string): FormArray {
    return form.get(name) as FormArray;
  }

  addGroup(form: FormGroup, subsection: any): void {
    const formArray = this.getFormArray(form, subsection.name);
    const group: { [key: string]: any } = {};
    subsection.formGroupTemplate.forEach((field: any) => {
        const validators = this.buildValidators(field.validators);
        group[field.name] = [field.value ?? null, validators];
    });
    formArray.push(this.fb.group(group));
  }

  removeGroup(form: FormGroup, subsectionName: string, index: number): void {
    this.getFormArray(form, subsectionName).removeAt(index);
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  setupConditionalLogic(form: FormGroup, sections: any[]): void {
    const setupItemLogic = (item: any) => {
      if (!item) return;

      // Set initial visibility
      item._visible = !item.visibleWhen;

      const applyLogic = () => {
        // Conditional Visibility
        if (item.visibleWhen) {
          let isVisible = false;
          if (item.visibleWhen.or) {
            for (const condition of item.visibleWhen.or) {
              const targetControl = form.get(condition.field);
              if (targetControl && targetControl.value === condition.value) {
                isVisible = true;
                break;
              }
            }
          } else {
            const targetControl = form.get(item.visibleWhen.field);
            if (targetControl) {
              isVisible = targetControl.value === item.visibleWhen.value;
            }
          }

          const wasVisible = item._visible;
          item._visible = isVisible;

          if (item.name) {
            // only fields have name and can be reset
            // Reset touched state when field is hidden
            if (wasVisible && !item._visible) {
              const controlToReset = form.get(item.name);
              if (controlToReset) {
                controlToReset.markAsUntouched();
              }
            }
          }
        } else {
          item._visible = true;
        }

        // Conditional Validators (only for fields)
        if (item.validatorsWhen && item.name) {
          const control = form.get(item.name);
          if (control) {
            const baseValidators = this.buildValidators(item.validators);
            const conditionalValidators = item._visible
              ? this.buildValidators(item.validatorsWhen)
              : [];
            control.setValidators([...baseValidators, ...conditionalValidators]);
            control.updateValueAndValidity();
          }
        }
      };

      // Subscribe to dependencies for visibility and validators
      const dependencies = new Set<string>();
      if (item.visibleWhen) {
        if (item.visibleWhen.or) {
          item.visibleWhen.or.forEach((condition: any) =>
            dependencies.add(condition.field)
          );
        } else {
          dependencies.add(item.visibleWhen.field);
        }
      }
      if (item.validatorsWhen) {
        if (item.visibleWhen) {
          if (item.visibleWhen.or) {
            item.visibleWhen.or.forEach((condition: any) =>
              dependencies.add(condition.field)
            );
          } else {
            dependencies.add(item.visibleWhen.field);
          }
        }
      }

      dependencies.forEach((depName) => {
        const targetControl = form.get(depName);
        if (targetControl) {
          targetControl.valueChanges.subscribe(() => applyLogic());
        }
      });

      if (item.resetsFields && item.name) {
        const sourceControl = form.get(item.name);
        if (sourceControl) {
          sourceControl.valueChanges.subscribe(() => {
            item.resetsFields.forEach((fieldName: string) => {
              const controlToReset = form.get(fieldName);
              if (controlToReset) {
                controlToReset.reset();
              }
            });
          });
        }
      }

      applyLogic();
    };

    sections.forEach((section) => {
      section.subsections?.forEach((subsection: any) => {
        setupItemLogic(subsection);
        const fields =
          subsection.type === 'form-array'
            ? subsection.formGroupTemplate
            : subsection.fields || [];
        fields.forEach((field: any) => {
          setupItemLogic(field);
        });
      });
    });
  }
}
