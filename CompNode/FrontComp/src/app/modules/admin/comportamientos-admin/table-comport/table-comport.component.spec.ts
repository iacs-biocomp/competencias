import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComportComponent } from './table-comport.component';

describe('TableComportComponent', () => {
	let component: TableComportComponent;
	let fixture: ComponentFixture<TableComportComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TableComportComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TableComportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
