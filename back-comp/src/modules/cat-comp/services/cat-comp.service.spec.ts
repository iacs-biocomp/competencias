import { Test, TestingModule } from '@nestjs/testing';
import { CatCompService } from './cat-comp.service';

describe('CatCompService', () => {
  let service: CatCompService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatCompService],
    }).compile();

    service = module.get<CatCompService>(CatCompService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
