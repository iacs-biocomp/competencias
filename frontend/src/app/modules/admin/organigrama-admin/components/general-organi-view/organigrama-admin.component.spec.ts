import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganigramaAdminComponent } from './organigrama-admin.component';

describe('OrganigramaAdminComponent', () => {
	let component: OrganigramaAdminComponent;
	let fixture: ComponentFixture<OrganigramaAdminComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [OrganigramaAdminComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(OrganigramaAdminComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
