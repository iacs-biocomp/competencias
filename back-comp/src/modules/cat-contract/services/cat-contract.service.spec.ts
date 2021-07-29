import { Test, TestingModule } from '@nestjs/testing';
import { CatContractService } from './cat-contract.service';

describe('CatContractService', () => {
  let service: CatContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatContractService],
    }).compile();

    service = module.get<CatContractService>(CatContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
