import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCompetenciasComponent } from './mis-competencias.component';

describe('MisCompetenciasComponent', () => {
  let component: MisCompetenciasComponent;
  let fixture: ComponentFixture<MisCompetenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisCompetenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
