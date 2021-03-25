import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SedeElectronicaComponent } from './sede-electronica.component';

describe('SedeElectronicaComponent', () => {
	let component: SedeElectronicaComponent;
	let fixture: ComponentFixture<SedeElectronicaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SedeElectronicaComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SedeElectronicaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
