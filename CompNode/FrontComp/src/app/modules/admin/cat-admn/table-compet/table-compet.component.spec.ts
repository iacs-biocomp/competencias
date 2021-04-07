import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCompetComponent } from './table-compet.component';

describe('TableCompetComponent', () => {
  let component: TableCompetComponent;
  let fixture: ComponentFixture<TableCompetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCompetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCompetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
