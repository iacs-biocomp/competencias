import { Test, TestingModule } from '@nestjs/testing';
import { CatCompRepo } from 'src/modules/cat-comp/catComp.repository';
import { PeriodosRepo } from 'src/modules/trabajadores/periodos.repository';
import { CatContrRepo } from '../catContr.repository';
import { CatContractService } from '../services/cat-contract.service';
import { CatContractController } from './cat-contract.controller';

describe('CatContractController', () => {
	let controller: CatContractController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CatContractController],

			providers: [
				CatContractService,
				// TODO: Provide testing repositories contected to a testing db like sqlite
				{
					provide: CatContrRepo,
					useValue: {},
				},
				{
					provide: PeriodosRepo,
					useValue: {},
				},
				{
					provide: CatCompRepo,
					useValue: {},
				},
			],
		})
			.overrideProvider(CatContractService)
			.useValue({})
			.compile();

		controller = module.get<CatContractController>(CatContractController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
