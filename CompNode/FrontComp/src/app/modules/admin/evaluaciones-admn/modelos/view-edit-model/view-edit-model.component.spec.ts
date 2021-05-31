import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditModelComponent } from './view-edit-model.component';

describe('ViewEditModelComponent', () => {
	let component: ViewEditModelComponent;
	let fixture: ComponentFixture<ViewEditModelComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ViewEditModelComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewEditModelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
