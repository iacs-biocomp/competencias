import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelosComponent } from './modelos.component';

describe('ModelosComponent', () => {
  let component: ModelosComponent;
  let fixture: ComponentFixture<ModelosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
