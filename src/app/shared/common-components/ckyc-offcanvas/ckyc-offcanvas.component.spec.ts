import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkycOffcanvasComponent } from './ckyc-offcanvas.component';

describe('CkycOffcanvasComponent', () => {
  let component: CkycOffcanvasComponent;
  let fixture: ComponentFixture<CkycOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CkycOffcanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CkycOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
