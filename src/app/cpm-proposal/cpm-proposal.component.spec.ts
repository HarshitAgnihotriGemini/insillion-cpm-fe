import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpmProposalComponent } from './cpm-proposal.component';

describe('CpmProposalComponent', () => {
  let component: CpmProposalComponent;
  let fixture: ComponentFixture<CpmProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpmProposalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpmProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
