import { Test, TestingModule } from '@nestjs/testing';
import { ModelosService } from './modelos.service';

describe('ModelosService', () => {
  let service: ModelosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelosService],
    }).compile();

    service = module.get<ModelosService>(ModelosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
