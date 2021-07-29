import { Test, TestingModule } from '@nestjs/testing';
import { CompetenciasService } from './competencias.service';

describe('CompetenciasService', () => {
  let service: CompetenciasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetenciasService],
    }).compile();

    service = module.get<CompetenciasService>(CompetenciasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
