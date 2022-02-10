import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrabTableComponent } from './trab-table.component';

describe('TrabTableComponent', () => {
	let component: TrabTableComponent;
	let fixture: ComponentFixture<TrabTableComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TrabTableComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TrabTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
