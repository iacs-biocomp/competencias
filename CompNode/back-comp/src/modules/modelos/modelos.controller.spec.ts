import { Test, TestingModule } from '@nestjs/testing';
import { ModelosController } from './modelos.controller';

describe('ModelosController', () => {
	let controller: ModelosController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ModelosController],
		}).compile();

		controller = module.get<ModelosController>(ModelosController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
