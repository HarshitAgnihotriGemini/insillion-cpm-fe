import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EventHandlerDirective } from '../../directives/event-handler.directive';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule,
    EventHandlerDirective,
  ],
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent {
  @Input() field: any;
  @Input() form!: FormGroup;
  @Output() buttonClick = new EventEmitter<any>();
  @Output() fieldEvent = new EventEmitter<{ action: string; payload: any }>();

  constructor() {}

  get isInvalid(): boolean {
    const control = this.form.get(this.field.name);
    return control ? control.invalid && control.touched : false;
  }

  get errorMessage(): string | null {
    const control = this.form.get(this.field.name);
    if (this.isInvalid && control && control.errors) {
      const errorKeys = Object.keys(control.errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        return this.field.errors?.[firstErrorKey] || null;
      }
    }
    return null;
  }

  onButtonClick(): void {
    this.buttonClick.emit(this.field);
  }

  handleEvent(event: { action: string; payload: any }) {
    this.fieldEvent.emit(event);
  }
}
