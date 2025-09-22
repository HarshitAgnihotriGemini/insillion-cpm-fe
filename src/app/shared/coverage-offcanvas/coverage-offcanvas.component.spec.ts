import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageOffcanvasComponent } from './coverage-offcanvas.component';

describe('CoverageOffcanvasComponent', () => {
  let component: CoverageOffcanvasComponent;
  let fixture: ComponentFixture<CoverageOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverageOffcanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoverageOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
