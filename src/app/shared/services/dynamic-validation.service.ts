import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DateLimits {
  minDate?: Date;
  maxDate?: Date;
}

export interface NumericLimits {
  min?: number;
  max?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicValidationService {
  private dateLimits: { [key: string]: BehaviorSubject<DateLimits> } = {};
  private numericLimits: { [key: string]: BehaviorSubject<NumericLimits> } = {};
  private requiredStatus: { [key: string]: BehaviorSubject<boolean> } = {};

  private getDateLimitsSubject(fieldName: string): BehaviorSubject<DateLimits> {
    if (!this.dateLimits[fieldName]) {
      this.dateLimits[fieldName] = new BehaviorSubject<DateLimits>({});
    }
    return this.dateLimits[fieldName];
  }

  updateDateLimits(fieldName: string, minDate?: Date, maxDate?: Date): void {
    const subject = this.getDateLimitsSubject(fieldName);
    subject.next({ minDate, maxDate });
  }

  getMinDate$(fieldName: string): Observable<Date | undefined> {
    return this.getDateLimitsSubject(fieldName).pipe(map(limits => limits.minDate));
  }

  getMaxDate$(fieldName: string): Observable<Date | undefined> {
    return this.getDateLimitsSubject(fieldName).pipe(map(limits => limits.maxDate));
  }

  private getNumericLimitsSubject(fieldName: string): BehaviorSubject<NumericLimits> {
    if (!this.numericLimits[fieldName]) {
      this.numericLimits[fieldName] = new BehaviorSubject<NumericLimits>({});
    }
    return this.numericLimits[fieldName];
  }

  updateNumericLimits(fieldName: string, min?: number, max?: number): void {
    const subject = this.getNumericLimitsSubject(fieldName);
    subject.next({ min, max });
  }

  getMin$(fieldName: string): Observable<number | undefined> {
    return this.getNumericLimitsSubject(fieldName).pipe(map(limits => limits.min));
  }

  getMax$(fieldName: string): Observable<number | undefined> {
    return this.getNumericLimitsSubject(fieldName).pipe(map(limits => limits.max));
  }

  private getRequiredStatusSubject(fieldName: string): BehaviorSubject<boolean> {
    if (!this.requiredStatus[fieldName]) {
      this.requiredStatus[fieldName] = new BehaviorSubject<boolean>(false);
    }
    return this.requiredStatus[fieldName];
  }

  updateRequiredStatus(fieldName: string, isRequired: boolean): void {
    const subject = this.getRequiredStatusSubject(fieldName);
    subject.next(isRequired);
  }

  getRequiredStatus$(fieldName: string): Observable<boolean> {
    return this.getRequiredStatusSubject(fieldName).asObservable();
  }
}
