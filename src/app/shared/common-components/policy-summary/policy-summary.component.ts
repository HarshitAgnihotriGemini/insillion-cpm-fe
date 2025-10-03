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
  @Input() config: any; // In this context, config is a "section" object
  @Input() dataRes: any;

  ngOnInit(): void {
    console.log(this.dataRes);
  }

  private getFieldValue(name: string): any {
    if (!this.config || !this.config.subsections) {
      return undefined;
    }

    for (const subsection of this.config.subsections) {
      if (subsection.fields) {
        const field = subsection.fields.find((f: any) => f.name === name);
        if (field) {
          return field.value;
        }
      }
    }
    return undefined;
  }

  shouldShowField(field: any): boolean {
    if (!field.visibleWhen) {
      return true;
    }

    const condition = field.visibleWhen;

    // Handle OR conditions
    if (condition.or) {
      for (const rule of condition.or) {
        const dependencyValue = this.getFieldValue(rule.field);
        if (dependencyValue === rule.value) {
          return true; // If any 'or' condition is met, show the field
        }
      }
      return false; // If no 'or' conditions were met, hide the field
    }

    // Handle single condition
    if (condition.field) {
      const dependencyValue = this.getFieldValue(condition.field);
      if (dependencyValue === condition.value) {
        return true;
      }
    }

    return false; // Default to not showing if condition is present but not met
  }

  public objectKeys(obj: any): string[] {
    if (!obj) {
      return [];
    }
    return Object.keys(obj);
  }
}
