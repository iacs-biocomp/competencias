import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComportamientosAdminComponent } from './comportamientos-admin.component';

describe('ComportamientosAdminComponent', () => {
  let component: ComportamientosAdminComponent;
  let fixture: ComponentFixture<ComportamientosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComportamientosAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComportamientosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
