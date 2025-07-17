import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaAdminComponent } from './mapa-admin.component';

describe('MapaAdminComponent', () => {
  let component: MapaAdminComponent;
  let fixture: ComponentFixture<MapaAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapaAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
