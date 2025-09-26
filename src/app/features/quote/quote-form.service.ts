import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';
import * as cpmQuote from '@app/shared/schemas/cpm-quote.json';

@Injectable({
  providedIn: 'root',
})
export class QuoteFormService {
  constructor(private readonly formService: FormService) {}

  initializeForm(): FormGroup {
    return this.formService.createFormGroup(cpmQuote.sections);
  }
}
