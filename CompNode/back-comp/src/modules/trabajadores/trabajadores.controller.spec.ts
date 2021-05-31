import { Test, TestingModule } from '@nestjs/testing';
import { TrabajadoresController } from './trabajadores.controller';

describe('TrabajadoresController', () => {
	let controller: TrabajadoresController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TrabajadoresController],
		}).compile();

		controller = module.get<TrabajadoresController>(TrabajadoresController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
