import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';

import { AttachmentsComponent } from '../attachments/attachments.component';
import { FormService } from '@app/shared/services/form.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    AttachmentsComponent,
  ],
  templateUrl: './section.component.html',
})
export class SectionComponent implements OnInit {
  @Input() section: any;
  @Input() form!: FormGroup;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Output() buttonClick = new EventEmitter<any>();
  @Output() addFile = new EventEmitter<void>();
  @Output() removeFile = new EventEmitter<any>();
  @Output() fieldEvent = new EventEmitter<{ action: string; payload: any }>();
  imgPath: string;
  isExpanded = true;
  isOverflowVisible = false;

  constructor(
    private formService: FormService,
    private readonly apiService: ApiService,
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
  }

  ngOnInit(): void {
    this.isExpanded = this.section.isExpandedByDefault ?? true;
    if (this.isExpanded) {
      // If it starts expanded, make overflow visible immediately
      this.isOverflowVisible = true;
    }
  }

  get isCollapsible(): boolean {
    return this.section.isCollapsible === true;
  }

  toggle(): void {
    if (this.isCollapsible) {
      if (this.isExpanded) {
        // Start collapsing: hide overflow immediately, then start animation
        this.isOverflowVisible = false;
        this.isExpanded = false;
      } else {
        // Start expanding: start animation, overflow will be made visible on transition end
        this.isExpanded = true;
      }
    }
  }

  onTransitionEnd() {
    if (this.isExpanded) {
      this.isOverflowVisible = true;
    }
  }

  getFormArray(name: string): FormArray {
    return this.formService.getFormArray(this.form, name);
  }
  addGroup(subsection: any): void {
    if (
      subsection.limit &&
      this.getFormArray(subsection.name).length >= subsection.limit
    ) {
      return;
    }
    this.formService.addGroup(this.form, subsection);
  }

  removeGroup(subsection: any, index: number): void {
    this.formService.removeGroup(this.form, subsection.name, index);
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return this.formService.getFormGroup(control);
  }

  handleFieldEvent(event: { action: string; payload: any }) {
    this.fieldEvent.emit({ action: event.action, payload: event.payload });
  }

  toFormGroup(group: any) {
    return group as FormGroup;
  }
}