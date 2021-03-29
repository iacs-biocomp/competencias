import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionesController } from './evaluaciones.controller';

describe('EvaluacionesController', () => {
  let controller: EvaluacionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluacionesController],
    }).compile();

    controller = module.get<EvaluacionesController>(EvaluacionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
