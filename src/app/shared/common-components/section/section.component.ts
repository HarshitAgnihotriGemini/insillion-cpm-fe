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
  @Output() buttonClick = new EventEmitter<any>();
  @Output() addFile = new EventEmitter<void>();
  @Output() removeFile = new EventEmitter<any>();
  @Output() fieldEvent = new EventEmitter<{ action: string; payload: any }>();
  imgPath: string;

  constructor(
    private formService: FormService,
    private readonly apiService: ApiService,
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
  }
  isExpanded = true;

  ngOnInit(): void {
    this.isExpanded = this.section.isExpandedByDefault ?? true;
  }

  get isCollapsible(): boolean {
    return this.section.isCollapsible === true;
  }

  toggle(): void {
    if (this.isCollapsible) {
      this.isExpanded = !this.isExpanded;
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
