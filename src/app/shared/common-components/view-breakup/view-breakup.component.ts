import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ApiService } from '@app/shared/services/api.service';

@Component({
  selector: 'app-view-breakup',
  imports: [CommonModule],
  templateUrl: './view-breakup.component.html',
  styleUrl: './view-breakup.component.scss',
  standalone: true,
})
export class ViewBreakupComponent {
  @Input() config: any;
  imgPath: string;
  constructor(
    private readonly apiService: ApiService,
  ) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
  }
}