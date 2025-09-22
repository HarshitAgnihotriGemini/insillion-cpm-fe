import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  imports: [CommonModule, AccordionModule],
})
export class TermsAndConditionsModalComponent implements OnInit {
  // These properties will be passed in when the modal is opened
  title: string = 'Terms & Conditions';
  items: any[] = [];
  public itemStates: boolean[] = [];
  selectedItem: any;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {

  }

  selectItem(item: any): void {
    this.selectedItem = item;
  }
}
