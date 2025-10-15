import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@app/shared/services/api.service';

// Define an interface for a single breadcrumb item for type safety
export interface BreadcrumbItem {
  title: string;
  link: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {
  // This component accepts an array of breadcrumb items from its parent
  @Input() items: BreadcrumbItem[] = [];
  private apiservice = inject(ApiService);

  redirect(route: string){
    window.location.href = this.apiservice.domain + route;
  }
}
