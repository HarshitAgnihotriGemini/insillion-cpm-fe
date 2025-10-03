import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { REGEX_PATTERNS } from '../constants/constants';
import { UtilsService } from '../utils/utils.service';
@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(
    private readonly fb: FormBuilder,
    private readonly utilsService: UtilsService,
  ) {}

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
                  REGEX_PATTERNS[value as keyof typeof REGEX_PATTERNS],
                ),
              );
            } else {
              validatorFns.push(Validators.pattern(value));
            }
            break;
          case 'minDate':
            validatorFns.push(this.utilsService.minDate(value));
            break;
          case 'maxDate':
            validatorFns.push(this.utilsService.maxDate(value));
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
    const setupItemLogic = (item: any, isSubsection: boolean) => {
      if (!item) return;

      const hasConditionalVisibility = !!item.visibleWhen;
      item._visible = !hasConditionalVisibility;

      const applyLogic = () => {
        let isVisible = true;
        if (hasConditionalVisibility) {
          isVisible = false;
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
        }

        if (item._visible !== isVisible) {
          item._visible = isVisible;

          if (isSubsection) {
            if (item.type === 'form-array') {
              const formArray = form.get(item.name) as FormArray;
              if (formArray) {
                if (isVisible) {
                  formArray.enable();
                } else {
                  formArray.disable();
                  formArray.clear();
                }
              }
            } else {
              const fields = item.fields || [];
              fields.forEach((field: any) => {
                const control = form.get(field.name);
                if (control) {
                  if (isVisible) {
                    control.enable();
                  } else {
                    control.disable();
                    control.reset();
                  }
                }
              });
            }
          } else {
            // is a field
            const control = form.get(item.name);
            if (control) {
              if (isVisible) {
                control.enable();
              } else {
                control.disable();
                control.reset();
              }
            }
          }
        }

        if (!isSubsection && item.validatorsWhen) {
          const control = form.get(item.name);
          if (control) {
            const baseValidators = this.buildValidators(item.validators);
            const conditionalValidators = item._visible
              ? this.buildValidators(item.validatorsWhen)
              : [];
            control.setValidators([
              ...baseValidators,
              ...conditionalValidators,
            ]);
            control.updateValueAndValidity();
          }
        }
      };

      const dependencies = new Set<string>();
      if (hasConditionalVisibility) {
        if (item.visibleWhen.or) {
          item.visibleWhen.or.forEach((condition: any) =>
            dependencies.add(condition.field),
          );
        } else {
          dependencies.add(item.visibleWhen.field);
        }
      }
      if (!isSubsection && item.validatorsWhen) {
        if (item.visibleWhen) {
          if (item.visibleWhen.or) {
            item.visibleWhen.or.forEach((condition: any) =>
              dependencies.add(condition.field),
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

      if (!isSubsection && item.resetsFields) {
        const sourceControl = form.get(item.name);
        if (sourceControl) {
          sourceControl.valueChanges.subscribe(() => {
            item.resetsFields.forEach((fieldName: string) => {
              const controlToReset = form.get(fieldName);
              if (controlToReset) {
                if (controlToReset instanceof FormArray) {
                  controlToReset.clear();
                } else {
                  controlToReset.reset();
                }
              }
            });
          });
        }
      }

      applyLogic();
    };

    sections.forEach((section) => {
      section.subsections?.forEach((subsection: any) => {
        setupItemLogic(subsection, true);
        const fields =
          subsection.type === 'form-array'
            ? subsection.formGroupTemplate
            : subsection.fields || [];
        fields.forEach((field: any) => {
          setupItemLogic(field, false);
        });
      });
    });
  }
}
