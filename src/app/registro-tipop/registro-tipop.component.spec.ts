import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroTipopComponent } from './registro-tipop.component';

describe('RegistroTipopComponent', () => {
  let component: RegistroTipopComponent;
  let fixture: ComponentFixture<RegistroTipopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroTipopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroTipopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
