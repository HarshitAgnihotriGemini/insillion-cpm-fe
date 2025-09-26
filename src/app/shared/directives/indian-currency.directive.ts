import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[indianCurrency]',
})
export class IndianCurrencyDirective implements OnChanges {
  @Input('indianCurrency') condition: any;

  constructor(private readonly control: NgControl) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('condition' in changes) {
      //To update the validation on change of control
      this.currencyFormat();
    }
  }

  currencyFormat() {
    const control = this.control?.control;
    const formValue = this.control?.value?.replace(/\D/g, '');

    // Parse the input value as a number
    // Format the numeric value in Indian currency format
    if (
      control?.valid &&
      formValue !== '' &&
      formValue !== undefined &&
      formValue !== 0 &&
      formValue !== null &&
      formValue
    ) {
      control?.setValue(
        new Intl.NumberFormat('en-IN').format(
          formValue?.toString()?.replaceAll(/,/g, '')
        ),
        { emitEvent: false }
      );
      // Update the input element's value with the formatted value
      control?.setValue(formValue?.toString()?.replaceAll(/,/g, ''), {
        emitModelToViewChange: false,
        emitEvent: false,
      });
    } else {
      control?.setValue(formValue?.toString()?.replaceAll(/,/g, ''), {
        emitEvent: false,
      });
    }
  }
}
