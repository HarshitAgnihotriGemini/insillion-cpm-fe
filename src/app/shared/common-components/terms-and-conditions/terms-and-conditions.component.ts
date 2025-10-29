import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QuoteService } from '@app/features/quote/quote.service';
import { ApiService } from '@app/shared/services/api.service';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  imports: [CommonModule, AccordionModule, ReactiveFormsModule],
})
export class TermsAndConditionsModalComponent implements OnInit {
  title: string = 'Terms & Conditions';
  items: any[] = [];
  public itemStates: boolean[] = [];
  selectedItem: any;
  imgPath: string;
  clauseForm: FormGroup;
  clause_wordings: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private readonly apiService: ApiService,
    private readonly fb: FormBuilder,
    private readonly quoteService: QuoteService,
    private readonly toastr: ToastrService
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
    this.clauseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (
      this.quoteService.premiumCalcRes &&
      this.quoteService.premiumCalcRes.clause_wordings
    ) {
      this.clause_wordings = this.quoteService.premiumCalcRes.clause_wordings;
    }
  }

  selectItem(item: any): void {
    this.selectedItem = item;
  }

  clearClauseForm() {
    this.clauseForm.reset();
  }

  async addClause() {
    if (this.clauseForm.invalid) {
      this.clauseForm.markAllAsTouched();
      this.toastr.error('Please fill all the fields');
      return;
    }

    const newClause = {
      name: this.clauseForm.value.name,
      description: this.clauseForm.value.description,
      applicability: 'custom',
      selected: 'true',
      clause_id: `C${String(this.clause_wordings.length + 1).padStart(3, '0')}`,
    };

    this.clause_wordings.push(newClause);

    try {
      await this.quoteService.premiumCalc();
      this.toastr.success('Clause added and premium recalculated.');
      this.clauseForm.reset();
    } catch (error: any) {
      this.toastr.error(error.message || 'Error recalculating premium.');
      // remove the added clause if api fails
      this.clause_wordings.pop();
    }
  }
}