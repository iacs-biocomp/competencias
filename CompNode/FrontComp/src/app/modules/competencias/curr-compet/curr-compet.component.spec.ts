import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrCompetComponent } from './curr-compet.component';

describe('CurrCompetComponent', () => {
	let component: CurrCompetComponent;
	let fixture: ComponentFixture<CurrCompetComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CurrCompetComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CurrCompetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
