import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCompSelectComponent } from './model-comp-select.component';

describe('ModelCompSelectComponent', () => {
  let component: ModelCompSelectComponent;
  let fixture: ComponentFixture<ModelCompSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelCompSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCompSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
