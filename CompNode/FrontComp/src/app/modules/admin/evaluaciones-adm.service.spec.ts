import { TestBed } from '@angular/core/testing';

import { EvaluacionesAdmService } from './evaluaciones-admn/services/evaluaciones-adm.service';

describe('EvaluacionesAdmService', () => {
  let service: EvaluacionesAdmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluacionesAdmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
