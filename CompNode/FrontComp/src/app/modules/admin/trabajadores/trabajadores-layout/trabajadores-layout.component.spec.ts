import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabajadoresLayoutComponent } from './trabajadores-layout.component';

describe('TrabajadoresLayoutComponent', () => {
  let component: TrabajadoresLayoutComponent;
  let fixture: ComponentFixture<TrabajadoresLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrabajadoresLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajadoresLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
