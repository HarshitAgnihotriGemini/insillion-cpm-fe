import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total-premium',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './total-premium.component.html',
  styleUrls: ['./total-premium.component.scss'],
})
export class TotalPremiumComponent {
  @Input() totalPremium: any;
  @Output() viewBreakup = new EventEmitter<void>();

  onViewBreakup(): void {
    this.viewBreakup.emit();
  }
}
