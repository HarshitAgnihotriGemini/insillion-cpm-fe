import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attachments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attachments.component.html',
})
export class AttachmentsComponent implements OnInit {
  @Input() section: any;
  public files: any[] = [];
  constructor() {}
  ngOnInit(): void {
    if (this.section?.data && this.section?.data?.files) {
      this.files = [...this.section.data.files];
    }
  }
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const newFile = {
        name: file.name,
        id: `(${Math.round(file.size / 1024)} KB)`,
        actionLabel: 'Remove',
      };
      this.files.push(newFile);
    }
  }

  removeFile(fileToRemove: any): void {
    this.files = this.files.filter((file) => file !== fileToRemove);
  }
}
