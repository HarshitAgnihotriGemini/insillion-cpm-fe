import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';
import * as cpmQuote from '@app/shared/schemas/cpm-quote.json';

@Injectable({
  providedIn: 'root',
})
export class QuoteFormService {
  public form!: FormGroup;

  constructor(private readonly formService: FormService) {}

  initializeForm(): FormGroup {
    this.form = this.formService.createFormGroup(cpmQuote.sections);
    this.formService.setupConditionalLogic(this.form, cpmQuote.sections);
    return this.form;
  }
}
