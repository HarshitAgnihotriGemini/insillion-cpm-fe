import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormService } from '@app/shared/services/form.service';
import * as cpmProposal from '@app/shared/schemas/cpm-proposal.json';

@Injectable({
  providedIn: 'root',
})
export class ProposalFormService {
  public form!: FormGroup;

  constructor(private readonly formService: FormService, private readonly fb: FormBuilder) {}

  initializeForm(): FormGroup {
    this.form = this.formService.createFormGroup(cpmProposal.sections);

    cpmProposal.offCanvasConfigs.fields.forEach((field: any) => {
      this.form.addControl(field.name, this.fb.control(false));
      if (field.subFields) {
        const group = this.fb.group({});
        field.subFields.forEach((subField: any) => {
          group.addControl(subField.name, this.fb.control(null));
        });
        this.form.addControl(field.name + '_group', group);
      }
    });

    this.formService.setupConditionalLogic(this.form, cpmProposal.sections);
    return this.form;
  }
}
