import { Test, TestingModule } from '@nestjs/testing';
import { ComportamientosController } from './comportamientos.controller';

describe('ComportamientosController', () => {
	let controller: ComportamientosController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ComportamientosController],
		}).compile();

		controller = module.get<ComportamientosController>(ComportamientosController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
