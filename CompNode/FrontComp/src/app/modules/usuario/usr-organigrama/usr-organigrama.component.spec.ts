import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsrOrganigramaComponent } from './usr-organigrama.component';

describe('UsrOrganigramaComponent', () => {
  let component: UsrOrganigramaComponent;
  let fixture: ComponentFixture<UsrOrganigramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsrOrganigramaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsrOrganigramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
