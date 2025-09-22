import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule,
  ],
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
  @Input() field: any;
  @Input() form!: FormGroup;
  @Output() buttonClick = new EventEmitter<any>();
  constructor() {}
  get isInvalid(): boolean {
    const control = this.form.get(this.field.name);
    return control ? control.invalid && control.touched : false;
  }
  getErrorKeys(errors: object | null | undefined): string[] {
    return errors ? Object.keys(errors) : [];
  }
  onButtonClick(): void {
    this.buttonClick.emit(this.field);
  }

}
