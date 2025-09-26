import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewQuoteComponent } from './review-quote.component';

describe('ReviewQuoteComponent', () => {
  let component: ReviewQuoteComponent;
  let fixture: ComponentFixture<ReviewQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewQuoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
