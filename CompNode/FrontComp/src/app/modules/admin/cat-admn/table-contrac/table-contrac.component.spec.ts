import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContracComponent } from './table-contrac.component';

describe('TableContracComponent', () => {
  let component: TableContracComponent;
  let fixture: ComponentFixture<TableContracComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableContracComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableContracComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
