import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentsReviewComponent } from './attachments-review.component';

describe('AttachmentsReviewComponent', () => {
  let component: AttachmentsReviewComponent;
  let fixture: ComponentFixture<AttachmentsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentsReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
