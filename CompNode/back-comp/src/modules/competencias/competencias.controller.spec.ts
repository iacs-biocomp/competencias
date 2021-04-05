import { Test, TestingModule } from '@nestjs/testing';
import { CompetenciasController } from './competencias.controller';

describe('CompetenciasController', () => {
  let controller: CompetenciasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompetenciasController],
    }).compile();

    controller = module.get<CompetenciasController>(CompetenciasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
