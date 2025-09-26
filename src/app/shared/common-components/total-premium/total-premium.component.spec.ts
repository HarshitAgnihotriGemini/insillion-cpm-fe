import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPremiumComponent } from './total-premium.component';

describe('TotalPremiumComponent', () => {
  let component: TotalPremiumComponent;
  let fixture: ComponentFixture<TotalPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalPremiumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
