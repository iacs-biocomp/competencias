import { Test, TestingModule } from '@nestjs/testing';
import { CatCompController } from './cat-comp.controller';

describe('CatCompController', () => {
  let controller: CatCompController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatCompController],
    }).compile();

    controller = module.get<CatCompController>(CatCompController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
