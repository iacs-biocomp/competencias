import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisEvaluacionesComponent } from './mis-evaluaciones.component';

describe('MisEvaluacionesComponent', () => {
	let component: MisEvaluacionesComponent;
	let fixture: ComponentFixture<MisEvaluacionesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [MisEvaluacionesComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MisEvaluacionesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
