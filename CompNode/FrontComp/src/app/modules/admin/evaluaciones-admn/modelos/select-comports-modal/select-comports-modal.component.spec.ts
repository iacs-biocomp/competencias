import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectComportsModalComponent } from './select-comports-modal.component';

describe('SelectComportsModalComponent', () => {
	let component: SelectComportsModalComponent;
	let fixture: ComponentFixture<SelectComportsModalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SelectComportsModalComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectComportsModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
