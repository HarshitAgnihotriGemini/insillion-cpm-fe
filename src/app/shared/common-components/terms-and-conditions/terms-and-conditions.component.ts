import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/shared/services/api.service';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  imports: [CommonModule, AccordionModule],
})
export class TermsAndConditionsModalComponent implements OnInit {
  title: string = 'Terms & Conditions';
  items: any[] = [];
  public itemStates: boolean[] = [];
  selectedItem: any;
  imgPath: string;

  constructor(
    public bsModalRef: BsModalRef,
    private readonly apiService: ApiService,
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
  }

  ngOnInit(): void {}

  selectItem(item: any): void {
    this.selectedItem = item;
  }
}
