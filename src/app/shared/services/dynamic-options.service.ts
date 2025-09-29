import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DynamicOptionsService {
  private optionsSources: {
    [key: string]: BehaviorSubject<any[]>;
  } = {
    propositionOptions: new BehaviorSubject<any[]>([]),
    transactionTypeOptions: new BehaviorSubject<any[]>([]),
    productOptions: new BehaviorSubject<any[]>([]),
  };

  constructor() {}

  getOptions(key: string): Observable<any[]> {
    if (!this.optionsSources[key]) {
      this.optionsSources[key] = new BehaviorSubject<any[]>([]);
    }
    return this.optionsSources[key].asObservable();
  }

  setOptions(key: string, options: []): void {
    if (!this.optionsSources[key]) {
      this.optionsSources[key] = new BehaviorSubject<any[]>([]);
    }
    this.optionsSources[key].next(options);
  }
}
