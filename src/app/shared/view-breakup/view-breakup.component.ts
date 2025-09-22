import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-breakup',
  imports: [CommonModule],
  templateUrl: './view-breakup.component.html',
  styleUrl: './view-breakup.component.scss',
})
export class ViewBreakupComponent {
  config: any;
  constructor(public bsModalRef: BsModalRef) {}
}
