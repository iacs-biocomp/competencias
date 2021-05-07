import { TestBed } from '@angular/core/testing';

import { EvModelsAdmnService } from './ev-models-admn.service';

describe('EvModelsAdmnService', () => {
  let service: EvModelsAdmnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvModelsAdmnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
