import { Test, TestingModule } from '@nestjs/testing';
import { ValoracionesService } from './valoraciones.service';

describe('ValoracionesService', () => {
  let service: ValoracionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValoracionesService],
    }).compile();

    service = module.get<ValoracionesService>(ValoracionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
