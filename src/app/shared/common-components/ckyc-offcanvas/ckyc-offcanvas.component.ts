import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormFieldComponent } from '../form-field/form-field.component';
import * as ckycConfig from '@app/shared/schemas/ckyc-config.json';
@Component({
  selector: 'app-ckyc-offcanvas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormFieldComponent,
  ],
  templateUrl: './ckyc-offcanvas.component.html',
})
export class CkycOffcanvasComponent implements OnInit {
  config: any;
  form!: FormGroup;

  offcanvasService = inject(NgbOffcanvas);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.config = ckycConfig;
    this.form = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    const group = this.fb.group({});
    this.config.sections.forEach((section: any) => {
      section.fields?.forEach((field: any) => {
        group.addControl(field.name, this.fb.control(field.value ?? null));
      });
    });
    return group;
  }
}
