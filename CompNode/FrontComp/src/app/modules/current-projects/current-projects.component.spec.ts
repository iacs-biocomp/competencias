import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentProjectsComponent } from './current-projects.component';

describe('CurrentProjectsComponent', () => {
	let component: CurrentProjectsComponent;
	let fixture: ComponentFixture<CurrentProjectsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CurrentProjectsComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CurrentProjectsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
