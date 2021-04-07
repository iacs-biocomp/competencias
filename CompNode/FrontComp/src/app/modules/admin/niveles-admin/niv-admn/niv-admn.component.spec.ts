import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivAdmnComponent } from './niv-admn.component';

describe('NivAdmnComponent', () => {
  let component: NivAdmnComponent;
  let fixture: ComponentFixture<NivAdmnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NivAdmnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NivAdmnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
