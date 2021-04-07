import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEvComponent } from './list-ev.component';

describe('ListEvComponent', () => {
  let component: ListEvComponent;
  let fixture: ComponentFixture<ListEvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
