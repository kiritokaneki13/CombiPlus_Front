import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroNameComponent } from './registro-name.component';

describe('RegistroNameComponent', () => {
  let component: RegistroNameComponent;
  let fixture: ComponentFixture<RegistroNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroNameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
