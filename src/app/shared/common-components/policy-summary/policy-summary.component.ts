import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-policy-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy-summary.component.html',
  styleUrls: ['./policy-summary.component.scss'],
})
export class PolicySummaryComponent {
  @Input() config: any;
}
