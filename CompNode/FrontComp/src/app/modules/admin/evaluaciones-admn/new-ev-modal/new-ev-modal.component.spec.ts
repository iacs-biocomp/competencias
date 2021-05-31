import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEvModalComponent } from './new-ev-modal.component';

describe('NewEvModalComponent', () => {
	let component: NewEvModalComponent;
	let fixture: ComponentFixture<NewEvModalComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NewEvModalComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NewEvModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
