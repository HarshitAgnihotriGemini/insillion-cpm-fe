import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '@app/shared/services/api.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-breakup',
  imports: [CommonModule],
  templateUrl: './view-breakup.component.html',
  styleUrl: './view-breakup.component.scss',
  standalone: true,
})
export class ViewBreakupComponent {
  config: any;
  imgPath: string;
  constructor(
    public bsModalRef: BsModalRef,
    private readonly apiService: ApiService,
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
  }
}
