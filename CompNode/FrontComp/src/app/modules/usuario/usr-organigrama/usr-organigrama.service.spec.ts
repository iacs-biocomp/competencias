import { TestBed } from '@angular/core/testing';

import { UsrOrganigramaService } from './usr-organigrama.service';

describe('UsrOrganigramaService', () => {
  let service: UsrOrganigramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsrOrganigramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
