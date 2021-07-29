import { Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { Role } from 'src/entity';
import { RoleService } from '../services/role.service';

@Controller('nest/roles')
export class RoleController {
	constructor(private readonly _roleService: RoleService) {}
	@Get(':id')
	async getRole(@Param('id', ParseIntPipe) id: number): Promise<Role> {
		return this._roleService.get(id);
	}

	@Get()
	async getRoles(): Promise<Role[]> {
		return this._roleService.getAll();
	}

	@Post()
	async createRole(@Body() role: Role): Promise<Role> {
		return this._roleService.create(role);
	}

	@Patch(':id')
	async updateRole(@Param('id', ParseIntPipe) id: number, @Body() role: Role) {
		return this._roleService.update(id, role);
	}

	@Delete(':id')
	async deleteRole(@Param('id', ParseIntPipe) id: number) {
		return this._roleService.delete(id);
	}
}
