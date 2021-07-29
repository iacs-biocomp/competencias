import { Test, TestingModule } from '@nestjs/testing';
import { ComportamientosService } from './comportamientos.service';

describe('ComportamientosService', () => {
  let service: ComportamientosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComportamientosService],
    }).compile();

    service = module.get<ComportamientosService>(ComportamientosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
