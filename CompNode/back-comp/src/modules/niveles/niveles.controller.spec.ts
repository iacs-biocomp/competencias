import { Test, TestingModule } from '@nestjs/testing';
import { NivelesController } from './niveles.controller';

describe('NivelesController', () => {
  let controller: NivelesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NivelesController],
    }).compile();

    controller = module.get<NivelesController>(NivelesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
