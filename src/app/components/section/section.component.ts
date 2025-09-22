import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { AttachmentsComponent } from '../../shared/attachments/attachments.component'; // Import the form field component

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
  constructor(private fb: FormBuilder) {}
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
    return this.form.get(name) as FormArray;
  }
  addGroup(subsection: any): void {
    const formArray = this.getFormArray(subsection.name);
    const newGroup = this.fb.group({});
    subsection.formGroupTemplate.forEach((field: any) => {
      const validators = field.validators?.required
        ? [Validators.required]
        : [];
      newGroup.addControl(
        field.name,
        this.fb.control(field.value ?? null, validators)
      );
    });

    formArray.push(newGroup);
  }

  removeGroup(subsection: any, index: number): void {
    this.getFormArray(subsection.name).removeAt(index);
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

 
}
