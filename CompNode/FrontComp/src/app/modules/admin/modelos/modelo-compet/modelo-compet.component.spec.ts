import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeloCompetComponent } from './modelo-compet.component';

describe('ModeloCompetComponent', () => {
  let component: ModeloCompetComponent;
  let fixture: ComponentFixture<ModeloCompetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeloCompetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeloCompetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
