import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalQuestionnaireOffcanvasComponent } from './proposal-questionnaire-offcanvas.component';

describe('ProposalQuestionnaireOffcanvasComponent', () => {
  let component: ProposalQuestionnaireOffcanvasComponent;
  let fixture: ComponentFixture<ProposalQuestionnaireOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProposalQuestionnaireOffcanvasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalQuestionnaireOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
