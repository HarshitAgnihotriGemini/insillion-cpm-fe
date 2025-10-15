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
  private sections: any[] = [];
  private form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly utilsService: UtilsService,
  ) {}

  setFieldVisibility(fieldName: string, isVisible: boolean) {
    this.sections.forEach((section) => {
      section.subsections?.forEach((subsection: any) => {
        const fields =
          subsection.type === 'form-array'
            ? subsection.formGroupTemplate
            : subsection.fields || [];
        const field = fields.find((f: any) => f.name === fieldName);
        if (field) {
          field._visible = isVisible;
          const control = this.form.get(fieldName);
          if (control) {
            if (isVisible) {
              control.enable();
            } else {
              control.disable();
              control.reset();
            }

            if (field.validatorsWhen) {
              const baseValidators = this.buildValidators(
                field.validators,
                field,
              );
              const conditionalValidators = isVisible
                ? this.buildValidators(field.validatorsWhen, field)
                : [];
              control.setValidators([
                ...baseValidators,
                ...conditionalValidators,
              ]);
              control.updateValueAndValidity();
            }
          }
          if (field.dependentFields) {
            field.dependentFields.forEach((dependentFieldName: string) => {
              this.setFieldVisibility(dependentFieldName, isVisible);
            });
          }
        }
      });
    });
  }

  createFormGroup(sections: any[]): FormGroup {
    this.sections = sections;
    const group = this.fb.group({});
    sections.forEach((section) => {
      section.subsections?.forEach((subsection: any) => {
        if (subsection.type === 'form-array') {
          group.addControl(subsection.name, this.fb.array([]));
          if (subsection.initialGroups) {
            for (let i = 0; i < subsection.initialGroups; i++) {
              this.addGroup(group, subsection);
            }
          }
        } else {
          subsection.fields?.forEach((field: any) => {
            const validators = this.buildValidators(field.validators, field);
            let value = field.value ?? null;
            let disabled = false;
            if (field.type === 'toggle' && field.validators?.required) {
              value = true;
              disabled = true;
            }
            group.addControl(
              field.name,
              this.fb.control({ value, disabled }, validators),
            );
          });
        }
      });
    });
    this.form = group;
    return group;
  }

  buildValidators(validators: any, field: any): ValidatorFn[] {
    const validatorFns: ValidatorFn[] = [];
    if (validators) {
      for (const key in validators) {
        const value = validators[key];
        switch (key) {
          case 'required':
            if (value) {
              if (field.type === 'toggle') {
                validatorFns.push(Validators.requiredTrue);
              } else {
                validatorFns.push(Validators.required);
              }
            }
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

  addGroup(form: FormGroup, subsection: any, initialState?: any): void {
    const formArray = this.getFormArray(form, subsection.name);
    const group = this.fb.group({});

    subsection.formGroupTemplate.forEach((field: any) => {
      const validators = this.buildValidators(field.validators, field);
      const value = initialState
        ? initialState[field.name]
        : (field.value ?? null);
      group.addControl(field.name, this.fb.control(value, validators));
    });

    formArray.push(group);
  }

  removeGroup(form: FormGroup, subsectionName: string, index: number): void {
    this.getFormArray(form, subsectionName).removeAt(index);
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  setFieldError(
    form: FormGroup,
    fieldName: string,
    errorKey: string,
    errorMessage: string,
  ) {
    const control = form.get(fieldName);
    if (control) {
      control.setErrors({ [errorKey]: errorMessage });
      control.markAsTouched();
    }
  }

  setupConditionalLogic(form: FormGroup, sections: any[]): void {
    const setupItemLogic = (item: any, isSubsection: boolean) => {
      if (!item) return;

      const hasConditionalVisibility = !!item.visibleWhen;
      if (item.hidden) {
        item._visible = false;
      } else {
        item._visible = !hasConditionalVisibility;
      }

      const applyLogic = () => {
        let isVisible = !item.hidden;
        if (hasConditionalVisibility) {
          isVisible = false;
          if (item.visibleWhen.and) {
            let allConditionsMet = true;
            for (const condition of item.visibleWhen.and) {
              if (condition.or) {
                let orConditionMet = false;
                for (const orCondition of condition.or) {
                  const targetControl = form.get(orCondition.field);
                  if (
                    targetControl &&
                    targetControl.value === orCondition.value
                  ) {
                    orConditionMet = true;
                    break;
                  }
                }
                if (!orConditionMet) {
                  allConditionsMet = false;
                  break;
                }
              } else {
                const targetControl = form.get(condition.field);
                if (!targetControl || targetControl.value !== condition.value) {
                  allConditionsMet = false;
                  break;
                }
              }
            }
            if (allConditionsMet) {
              isVisible = true;
            }
          } else if (item.visibleWhen.or) {
            isVisible = false; // Assume false until a condition is met
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
              if (item.visibleWhen.value !== undefined) {
                isVisible = targetControl.value === item.visibleWhen.value;
              }
              if (item.visibleWhen.notValue !== undefined) {
                isVisible = targetControl.value !== item.visibleWhen.notValue;
              }
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

        if (!isSubsection && item.dependentFields) {
          item.dependentFields.forEach((dependentFieldName: string) => {
            this.setFieldVisibility(dependentFieldName, item._visible);
          });
        }

        if (!isSubsection && item.validatorsWhen) {
          const control = form.get(item.name);
          if (control) {
            const baseValidators = this.buildValidators(item.validators, item);
            const conditionalValidators = item._visible
              ? this.buildValidators(item.validatorsWhen, item)
              : [];
            control.setValidators([
              ...baseValidators,
              ...conditionalValidators,
            ]);
            if (
              item.type === 'toggle' &&
              item.validatorsWhen.required &&
              item._visible
            ) {
              control.setValue(true);
              control.disable();
            } else if (
              item.type === 'toggle' &&
              item.validatorsWhen.required &&
              !item._visible
            ) {
              control.enable();
            }
            control.updateValueAndValidity();
          }
        }
      };

      const dependencies = new Set<string>();
      if (hasConditionalVisibility) {
        if (item.visibleWhen.and) {
          item.visibleWhen.and.forEach((condition: any) => {
            if (condition.or) {
              condition.or.forEach((orCondition: any) => {
                dependencies.add(orCondition.field);
              });
            } else {
              dependencies.add(condition.field);
            }
          });
        } else if (item.visibleWhen.or) {
          item.visibleWhen.or.forEach((condition: any) =>
            dependencies.add(condition.field),
          );
        } else {
          dependencies.add(item.visibleWhen.field);
        }
      }
      if (!isSubsection && item.validatorsWhen) {
        if (item.visibleWhen) {
          if (item.visibleWhen.and) {
            item.visibleWhen.and.forEach((condition: any) => {
              if (condition.or) {
                condition.or.forEach((orCondition: any) => {
                  dependencies.add(orCondition.field);
                });
              } else {
                dependencies.add(condition.field);
              }
            });
          } else if (item.visibleWhen.or) {
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
