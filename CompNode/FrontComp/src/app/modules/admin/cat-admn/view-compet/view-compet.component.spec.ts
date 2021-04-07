import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCompetComponent } from './view-compet.component';

describe('ViewCompetComponent', () => {
	let component: ViewCompetComponent;
	let fixture: ComponentFixture<ViewCompetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ViewCompetComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ViewCompetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
