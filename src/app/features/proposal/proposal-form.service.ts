import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';
import * as cpmProposal from '@app/shared/schemas/cpm-proposal.json';

@Injectable({
  providedIn: 'root',
})
export class ProposalFormService {
  public form!: FormGroup;

  constructor(private readonly formService: FormService) {}

  initializeForm(): FormGroup {
    this.form = this.formService.createFormGroup(cpmProposal.sections);
    this.formService.setupConditionalLogic(this.form, cpmProposal.sections);
    return this.form;
  }
}
