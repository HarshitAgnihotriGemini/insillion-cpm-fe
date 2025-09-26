import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { ApiService } from '@app/shared/services/api.service';

@Component({
  selector: 'app-coverage-offcanvas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './coverage-offcanvas.component.html',
})
export class CoverageOffcanvasComponent {
  @Input() title: string = 'Coverage Options';
  @Input() config: any;
  form!: FormGroup;
  offcanvasService = inject(NgbOffcanvas);
  imgPath: string;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
  }
  ngOnInit(): void {
    this.form = this.createFormGroup();
  }
  openOffcanvas(content: any) {
    this.offcanvasService.open(content);
  }
  createFormGroup(): FormGroup {
    const group = this.fb.group({});
    this.config.items.forEach((item: any) => {
      if (item.dependentFields) {
        const nestedGroup = this.fb.group({});
        item.dependentFields.forEach((field: any) => {
          nestedGroup.addControl(
            field.name,
            this.fb.control(field.value ?? null),
          );
        });

        const mainControl = this.fb.control(item.checked);
        mainControl.valueChanges.subscribe((isChecked) => {
          isChecked ? nestedGroup.enable() : nestedGroup.disable();
        });

        if (!item.checked) {
          nestedGroup.disable();
        }
        group.addControl(item.name, nestedGroup);
        group.addControl(`${item.name}_checked`, mainControl);
      } else {
        group.addControl(item.name, this.fb.control(item.checked));
      }
    });
    return group;
  }
  getFormGroup(control: AbstractControl | null): FormGroup {
    return control as FormGroup;
  }
}
