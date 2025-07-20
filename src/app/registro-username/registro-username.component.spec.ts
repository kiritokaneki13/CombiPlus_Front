import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroUsernameComponent } from './registro-username.component';

describe('RegistroUsernameComponent', () => {
  let component: RegistroUsernameComponent;
  let fixture: ComponentFixture<RegistroUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroUsernameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
