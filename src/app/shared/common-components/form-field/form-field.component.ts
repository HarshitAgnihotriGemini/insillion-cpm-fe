import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EventHandlerDirective } from '../../directives/event-handler.directive';
import { DynamicOptionsService } from '@app/shared/services/dynamic-options.service';
import { Observable, of, Subscription } from 'rxjs';
import { NgxMaskDirective } from 'ngx-mask';
import { MASKS } from '@app/shared/constants/constants';
import moment from 'moment';
import { ApiService } from '@app/shared/services/api.service';
import { LoaderService } from '@app/shared/services/loader.service';
import { DynamicValidationService } from '@app/shared/services/dynamic-validation.service';

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
export class FormFieldComponent implements OnInit, OnDestroy {
  @Input() field: any;
  @Input() form!: FormGroup;
  @Input() fieldKey!: string;
  @Output() buttonClick = new EventEmitter<any>();
  @Output() fieldEvent = new EventEmitter<{ action: string; payload: any }>();

  options$!: Observable<any[]>;
  public readonly MASKS = MASKS;
  minDate?: Date;
  maxDate?: Date;
  min?: number;
  max?: number;
  loaderURL: string;
  loading$!: Observable<boolean>;
  private validationSub: Subscription = new Subscription();
  isRequired = false;

  constructor(
    private readonly dynamicOptionsService: DynamicOptionsService,
    private readonly apiService: ApiService,
    private readonly loaderService: LoaderService,
    private readonly dynamicValidationService: DynamicValidationService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.loaderURL = `${this.apiService.commonPath}/assets/images/Loader_blue.svg`;
  }

  ngOnInit(): void {
    this.loading$ = this.loaderService.isLoading(this.fieldKey);

    if (this.field.type === 'datepicker') {
      const minDateSub = this.dynamicValidationService
        .getMinDate$(this.fieldKey)
        .subscribe(date => {
          this.minDate = date;
        });
      const maxDateSub = this.dynamicValidationService
        .getMaxDate$(this.fieldKey)
        .subscribe(date => {
          this.maxDate = date;
        });

      this.validationSub.add(minDateSub);
      this.validationSub.add(maxDateSub);
    } else {
      const minSub = this.dynamicValidationService
        .getMin$(this.fieldKey)
        .subscribe(min => {
          this.min = min;
        });
      const maxSub = this.dynamicValidationService
        .getMax$(this.fieldKey)
        .subscribe(max => {
          this.max = max;
        });

      this.validationSub.add(minSub);
      this.validationSub.add(maxSub);
    }

    this.validationSub.add(
      this.dynamicValidationService.getRequiredStatus$(this.fieldKey).subscribe(isRequired => {
        this.isRequired = isRequired;
        this.cdr.markForCheck();
      })
    );

    if (this.minDate === undefined && this.field.validators?.minDate) {
      this.minDate = moment()
        .subtract(this.field.validators.minDate.daysAgo, 'days')
        .toDate();
    }

    if (this.maxDate === undefined && this.field.validators?.maxDate) {
      this.maxDate = moment()
        .add(this.field.validators.maxDate.daysFuture, 'days')
        .toDate();
    }

    if (this.field.optionsKey) {
      this.options$ = this.dynamicOptionsService.getOptions(
        this.field.optionsKey
      );
    } else {
      this.options$ = of(this.field.options || []);
    }
  }

  ngOnDestroy(): void {
    this.validationSub.unsubscribe();
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
              error.requiredLength
            );
          }
          if (firstErrorKey === 'minDate' || firstErrorKey === 'maxDate') {
            return errorMessageTemplate.replace(
              '{requiredDate}',
              error.requiredDate
            );
          }
          if (firstErrorKey === 'min') {
            return errorMessageTemplate.replace('{min}', this.min?.toString());
          }
          if (firstErrorKey === 'max') {
            return errorMessageTemplate.replace('{max}', this.max?.toString());
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
    this.buttonClick.emit({
      ...this.field,
      key: this.fieldKey,
    });
  }

  handleDateChange(event: any): void {
    const control = this.form.get(this.field.name);
    if (control) {
      control.setValue(event);
    }

    if (this.field.events) {
      const changeEvent = this.field.events.find(
        (e: any) => e.name === 'change'
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
        (e: any) => e.name === 'change'
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
        fieldKey: this.fieldKey,
      };
    }

    this.fieldEvent.emit({ action: event.action, payload: finalPayload });
  }
}
