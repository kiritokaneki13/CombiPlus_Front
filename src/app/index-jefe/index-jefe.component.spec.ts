import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexJefeComponent } from './index-jefe.component';

describe('IndexJefeComponent', () => {
  let component: IndexJefeComponent;
  let fixture: ComponentFixture<IndexJefeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexJefeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexJefeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
