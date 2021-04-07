import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivTableComponent } from './niv-table.component';

describe('NivTableComponent', () => {
	let component: NivTableComponent;
	let fixture: ComponentFixture<NivTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NivTableComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NivTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
