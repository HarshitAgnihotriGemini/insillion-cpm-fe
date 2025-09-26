import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-attachments-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attachments-review.component.html',
  styleUrls: ['./attachments-review.component.scss'],
})
export class AttachmentsReviewComponent {
  @Input() config: any;
  imgPath: string;

  constructor(private readonly apiService: ApiService) {
    this.imgPath = `${this.apiService.commonPath}/assets/`;
  }
}
