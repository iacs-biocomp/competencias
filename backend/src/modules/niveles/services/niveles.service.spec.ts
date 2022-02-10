import { Test, TestingModule } from '@nestjs/testing';
import { NivelesService } from './niveles.service';

describe('NivelesService', () => {
  let service: NivelesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NivelesService],
    }).compile();

    service = module.get<NivelesService>(NivelesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
