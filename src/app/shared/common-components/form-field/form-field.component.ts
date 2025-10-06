import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EventHandlerDirective } from '../../directives/event-handler.directive';
import { DynamicOptionsService } from '@app/shared/services/dynamic-options.service';
import { Observable, of } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { MASKS } from '@app/shared/constants/constants';
import moment from 'moment';
import { ApiService } from '@app/shared/services/api.service';
import { LoaderService } from '@app/shared/services/loader.service';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    BsDatepickerModule,
    EventHandlerDirective,
    NgxMaskDirective,
  ],
  templateUrl: './form-field.component.html',
})
export class FormFieldComponent implements OnInit {
  @Input() field: any;
  @Input() form!: FormGroup;
  @Input() fieldKey!: string;
  @Output() buttonClick = new EventEmitter<any>();
  @Output() fieldEvent = new EventEmitter<{ action: string; payload: any }>();

  options$!: Observable<any[]>;
  public readonly MASKS = MASKS;
  minDate?: Date;
  maxDate?: Date;
  loaderURL: string;
  loading$!: Observable<boolean>;

  constructor(
    private readonly dynamicOptionsService: DynamicOptionsService,
    private readonly apiService: ApiService,
    private readonly loaderService: LoaderService,
  ) {
    this.loaderURL = `${this.apiService.commonPath}/assets/images/Loader_blue.svg`;
  }

  ngOnInit(): void {
    this.loading$ = this.loaderService.isLoading(this.fieldKey);

    if (this.field.optionsKey) {
      this.options$ = this.dynamicOptionsService.getOptions(
        this.field.optionsKey,
      );
    } else {
      this.options$ = of(this.field.options || []);
    }

    if (this.field.validators?.minDate) {
      this.minDate = moment()
        .subtract(this.field.validators.minDate.daysAgo, 'days')
        .toDate();
    }

    if (this.field.validators?.maxDate) {
      this.maxDate = moment()
        .add(this.field.validators.maxDate.daysFuture, 'days')
        .toDate();
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

        if (typeof error === 'string') {
          return error;
        }

        const errorMessageTemplate = this.field.errors?.[firstErrorKey];

        if (errorMessageTemplate) {
          if (firstErrorKey === 'minLength' || firstErrorKey === 'maxLength') {
            return errorMessageTemplate.replace(
              '{requiredLength}',
              error.requiredLength,
            );
          }
          if (firstErrorKey === 'minDate' || firstErrorKey === 'maxDate') {
            return errorMessageTemplate.replace(
              '{requiredDate}',
              error.requiredDate,
            );
          }
          return errorMessageTemplate;
        }
      }
    }
    return null;
  }

  get maskPattern(): string {
    if (
      this.field.mask &&
      this.MASKS[this.field.mask as keyof typeof this.MASKS]
    ) {
      return this.MASKS[this.field.mask as keyof typeof this.MASKS];
    }
    return '';
  }

  onButtonClick(): void {
    this.buttonClick.emit(this.field);
  }

  handleDateChange(event: any): void {
    const control = this.form.get(this.field.name);
    if (control) {
      control.setValue(event);
    }

    if (this.field.events) {
      const changeEvent = this.field.events.find(
        (e: any) => e.name === 'change',
      );
      if (changeEvent) {
        const customEvent = {
          target: {
            value: event,
          },
          fieldKey: this.fieldKey,
        };
        this.fieldEvent.emit({
          action: changeEvent.action,
          payload: customEvent as any,
        });
      }
    }
  }

  handleNgSelectChange(event: any): void {
    if (this.field.events) {
      const changeEvent = this.field.events.find(
        (e: any) => e.name === 'change',
      );
      if (changeEvent) {
        const customEvent = {
          target: {
            value: event,
          },
          fieldKey: this.fieldKey,
        };
        this.fieldEvent.emit({
          action: changeEvent.action,
          payload: customEvent as any, // Type assertion to avoid type errors
        });
      }
    }
  }

  handleEvent(event: { action: string; payload: any }) {
    const originalPayload = event.payload;
    let finalPayload;

    if (originalPayload && originalPayload.target) {
      finalPayload = originalPayload;
      finalPayload.fieldKey = this.fieldKey;
    } else {
      finalPayload = {
        target: { value: originalPayload },
        fieldKey: this.fieldKey
      };
    }

    this.fieldEvent.emit({ action: event.action, payload: finalPayload });
  }
}
