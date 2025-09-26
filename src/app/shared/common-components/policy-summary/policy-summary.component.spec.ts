import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySummaryComponent } from './policy-summary.component';

describe('PolicySummaryComponent', () => {
  let component: PolicySummaryComponent;
  let fixture: ComponentFixture<PolicySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicySummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
