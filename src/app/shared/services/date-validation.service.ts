import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface DateValidationSubjects {
  minDate$: BehaviorSubject<Date | undefined>;
  maxDate$: BehaviorSubject<Date | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class DateValidationService {
  private controlSubjects = new Map<string, DateValidationSubjects>();

  private getSubjects(
    controlName: string,
    createIfNotExist: boolean = false
  ): DateValidationSubjects | undefined {
    if (!this.controlSubjects.has(controlName) && createIfNotExist) {
      this.controlSubjects.set(controlName, {
        minDate$: new BehaviorSubject<Date | undefined>(undefined),
        maxDate$: new BehaviorSubject<Date | undefined>(undefined),
      });
    }
    return this.controlSubjects.get(controlName);
  }

  getMinDate$(controlName: string): BehaviorSubject<Date | undefined> {
    return this.getSubjects(controlName, true)!.minDate$;
  }

  getMaxDate$(controlName: string): BehaviorSubject<Date | undefined> {
    return this.getSubjects(controlName, true)!.maxDate$;
  }

  updateLimits(
    controlName: string,
    minDate: Date | undefined,
    maxDate: Date | undefined
  ): void {
    const subjects = this.getSubjects(controlName, true)!;
    subjects.minDate$.next(minDate);
    subjects.maxDate$.next(maxDate);
  }
}
