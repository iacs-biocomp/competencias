import { RoleGuard } from './role.guard';
import { Reflector } from '@nestjs/core';

describe('RoleGuard', () => {
	it('should be defined', () => {
		expect(new RoleGuard(new Reflector())).toBeDefined();
	});
});
