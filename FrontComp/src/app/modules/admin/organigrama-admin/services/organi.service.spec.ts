import { TestBed } from '@angular/core/testing';

import { OrganiService } from './organi.service';

describe('OrganiService', () => {
	let service: OrganiService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(OrganiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
