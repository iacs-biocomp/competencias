import { Test, TestingModule } from '@nestjs/testing';
import { OrganigramaService } from './organigrama.service';

describe('OrganigramaService', () => {
  let service: OrganigramaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganigramaService],
    }).compile();

    service = module.get<OrganigramaService>(OrganigramaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
