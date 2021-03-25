import { TestBed } from '@angular/core/testing';

import { OrientService } from './orient.service';

describe('OrientService', () => {
	let service: OrientService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(OrientService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
