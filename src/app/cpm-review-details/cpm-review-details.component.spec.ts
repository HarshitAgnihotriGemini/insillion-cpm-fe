import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpmReviewDetailsComponent } from './cpm-review-details.component';

describe('CpmReviewDetailsComponent', () => {
  let component: CpmReviewDetailsComponent;
  let fixture: ComponentFixture<CpmReviewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpmReviewDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpmReviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
