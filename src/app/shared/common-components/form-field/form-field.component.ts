import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EventHandlerDirective } from '../../directives/event-handler.directive';
import { DynamicOptionsService } from '@app/shared/services/dynamic-options.service';
import { Observable, of } from 'rxjs';

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
export class FormFieldComponent implements OnInit {
  @Input() field: any;
  @Input() form!: FormGroup;
  @Output() buttonClick = new EventEmitter<any>();
  @Output() fieldEvent = new EventEmitter<{ action: string; payload: any }>();

  options$!: Observable<any[]>;

  constructor(private readonly dynamicOptionsService: DynamicOptionsService) {}

  ngOnInit(): void {
    if (this.field.optionsKey) {
      this.options$ = this.dynamicOptionsService.getOptions(
        this.field.optionsKey,
      );
    } else {
      this.options$ = of(this.field.options || []);
    }
  }

  get isInvalid(): boolean {
    const control = this.form.get(this.field.name);
    return control ? control.invalid && control.touched : false;
  }

  get errorMessage(): string | null {
    const control = this.form.get(this.field.name);
    if (this.isInvalid && control?.errors) {
      const errorKeys = Object.keys(control.errors);
      if (errorKeys.length > 0) {
        const firstErrorKey = errorKeys[0];
        const error = control.errors[firstErrorKey];
        const errorMessageTemplate = this.field.errors?.[firstErrorKey];

        if (errorMessageTemplate) {
          if (firstErrorKey === 'minlength' || firstErrorKey === 'maxlength') {
            return errorMessageTemplate.replace(
              '{requiredLength}',
              error.requiredLength,
            );
          }
          return errorMessageTemplate;
        }
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
