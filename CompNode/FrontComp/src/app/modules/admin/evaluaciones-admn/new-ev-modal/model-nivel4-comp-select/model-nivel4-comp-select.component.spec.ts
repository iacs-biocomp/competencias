import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelNivel4CompSelectComponent } from './model-nivel4-comp-select.component';

describe('ModelNivel4CompSelectComponent', () => {
  let component: ModelNivel4CompSelectComponent;
  let fixture: ComponentFixture<ModelNivel4CompSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelNivel4CompSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelNivel4CompSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
