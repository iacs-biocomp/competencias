import { Test, TestingModule } from '@nestjs/testing';
import { CatContractController } from './cat-contract.controller';

describe('CatContractController', () => {
  let controller: CatContractController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatContractController],
    }).compile();

    controller = module.get<CatContractController>(CatContractController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
