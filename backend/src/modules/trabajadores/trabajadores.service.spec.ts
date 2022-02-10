import { Test, TestingModule } from '@nestjs/testing';
import { TrabajadoresService } from './trabajadores.service';

describe('TrabajadoresService', () => {
  let service: TrabajadoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrabajadoresService],
    }).compile();

    service = module.get<TrabajadoresService>(TrabajadoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
