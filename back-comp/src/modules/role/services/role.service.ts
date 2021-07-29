import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RoleRepository } from '../role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entity';

@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(RoleRepository)
		private readonly _roleRepository: RoleRepository,
	) {}

	async get(id: number): Promise<Role> {
		const role = await this._roleRepository.findOne(id, {
			where: { status: 'ACTIVE' },
		});

		if (!role) {
			throw new NotFoundException();
		}

		return role;
	}

	async getAll(): Promise<Role[]> {
		return this._roleRepository.find({
			where: { status: 'ACTIVE' },
		});
	}

	async create(role: Role): Promise<Role> {
		return this._roleRepository.save(role);
	}

	async update(id: number, role: Role): Promise<void> {
		await this._roleRepository.update(id, role);
	}

	async delete(id: number): Promise<void> {
		const roleExists = await this._roleRepository.findOne(id, {
			where: { status: 'ACTIVE' },
		});

		if (!roleExists) {
			throw new NotFoundException();
		}

		await this._roleRepository.update(id, { status: 'INACTIVE' });
	}
}
