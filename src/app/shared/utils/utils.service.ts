import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  minDate(minDateConfig: { daysAgo: number }): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const date = moment(control.value, 'DD/MM/YYYY', true);
      if (!date.isValid()) {
        return null;
      }

      const minDate = moment()
        .subtract(minDateConfig.daysAgo, 'days')
        .startOf('day');

      if (date.isBefore(minDate)) {
        return {
          minDate: {
            requiredDate: minDate.format('DD/MM/YYYY'),
          },
        };
      }

      return null;
    };
  }

  maxDate(maxDateConfig: { daysFuture: number }): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const date = moment(control.value, 'DD/MM/YYYY', true);
      if (!date.isValid()) {
        return null;
      }

      const maxDate = moment()
        .add(maxDateConfig.daysFuture, 'days')
        .startOf('day');

      if (date.isAfter(maxDate)) {
        return {
          maxDate: {
            requiredDate: maxDate.format('DD/MM/YYYY'),
          },
        };
      }

      return null;
    };
  }

  static minDateDynamic(minDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // Handled by required validator
      }
      const controlDate = moment(control.value, 'DD/MM/YYYY');
      const min = moment(minDate).startOf('day');

      if (!controlDate.isValid()) {
        return { bsDate: { invalid: control.value } };
      }

      return controlDate.isBefore(min)
        ? {
            minDate: {
              requiredDate: min.format('DD/MM/YYYY'),
              actual: control.value,
            },
          }
        : null;
    };
  }

  static maxDateDynamic(maxDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // Handled by required validator
      }
      const controlDate = moment(control.value, 'DD/MM/YYYY');
      const max = moment(maxDate).endOf('day');

      if (!controlDate.isValid()) {
        return { bsDate: { invalid: control.value } };
      }

      return controlDate.isAfter(max)
        ? {
            maxDate: {
              requiredDate: max.format('DD/MM/YYYY'),
              actual: control.value,
            },
          }
        : null;
    };
  }

  /**
   * FormGroup validator to check if a start date is not after an end date.
   * @param startDateControlName The name of the start date control.
   * @param endDateControlName The name of the end date control.
   * @param errorName The name of the error to set on the end date control.
   */
  static startDateNotAfterEndDate(
    startDateControlName: string,
    endDateControlName: string,
    errorName: string,
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const startControl = formGroup.get(startDateControlName);
      const endControl = formGroup.get(endDateControlName);

      if (
        !startControl ||
        !endControl ||
        !startControl.value ||
        !endControl.value
      ) {
        return null;
      }

      const startDate = moment(startControl.value, 'DD/MM/YYYY', true);
      const endDate = moment(endControl.value, 'DD/MM/YYYY', true);

      if (
        startDate.isValid() &&
        endDate.isValid() &&
        startDate.isAfter(endDate)
      ) {
        endControl.setErrors({ ...endControl.errors, [errorName]: true });
      } else {
        if (endControl.hasError(errorName)) {
          const errors = { ...endControl.errors };
          delete errors[errorName];
          endControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }

      return null;
    };
  }

  /**
   * FormGroup validator to check if a date is between a start and an end date.
   * @param dateControlName The name of the date control to check.
   * @param startDateControlName The name of the start date control.
   * @param endDateControlName The name of the end date control.
   * @param errorName The name of the error to set on the date control.
   */
  static dateIsBetween(
    dateControlName: string,
    startDateControlName: string,
    endDateControlName: string,
    errorName: string,
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const dateControl = formGroup.get(dateControlName);
      const startControl = formGroup.get(startDateControlName);
      const endControl = formGroup.get(endDateControlName);

      if (
        !dateControl ||
        !startControl ||
        !endControl ||
        !dateControl.value ||
        !startControl.value ||
        !endControl.value
      ) {
        return null;
      }

      const date = moment(dateControl.value, 'DD/MM/YYYY', true);
      const startDate = moment(startControl.value, 'DD/MM/YYYY', true);
      const endDate = moment(endControl.value, 'DD/MM/YYYY', true);

      if (
        date.isValid() &&
        startDate.isValid() &&
        endDate.isValid() &&
        !date.isBetween(startDate, endDate, undefined, '[]')
      ) {
        dateControl.setErrors({ ...dateControl.errors, [errorName]: true });
      } else {
        if (dateControl.hasError(errorName)) {
          const errors = { ...dateControl.errors };
          delete errors[errorName];
          dateControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }

      return null;
    };
  }

  createReq(sections: any, formData: any) {
    const req: any = {};
    sections.forEach((section: any) => {
      section.subsections?.forEach((subsection: any) => {
        if (subsection.type === 'form-array') {
          req[subsection.name] = formData?.[subsection.name] || [];
        } else {
          subsection.fields?.forEach((field: any) => {
            if (field?.mask === 'DATE') {
              req[field.name] = formData?.[field.name]
                ? moment(formData?.[field.name], 'DD/MM/YYYY').format(
                    'YYYY-MM-DD',
                  )
                : '';
            } else {
              req[field.name] = formData?.[field.name] || '';
            }
          });
        }
      });
    });
    return req;
  }
}
