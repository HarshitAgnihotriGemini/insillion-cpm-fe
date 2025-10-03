import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private readonly loadingFields = new BehaviorSubject<Set<string>>(new Set());

  isLoading(fieldKey: string): Observable<boolean> {
    return this.loadingFields.pipe(
      map(loadingFields => loadingFields.has(fieldKey)),
      distinctUntilChanged()
    );
  }

  showLoader(fieldKey: string): void {
    this.loadingFields.next(this.loadingFields.value.add(fieldKey));
  }

  hideLoader(fieldKey: string): void {
    const currentFields = this.loadingFields.value;
    currentFields.delete(fieldKey);
    this.loadingFields.next(currentFields);
  }
}
