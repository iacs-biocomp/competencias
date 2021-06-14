import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalPersonaComponent } from './eval-persona.component';

describe('EvalPersonaComponent', () => {
	let component: EvalPersonaComponent;
	let fixture: ComponentFixture<EvalPersonaComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [EvalPersonaComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(EvalPersonaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
