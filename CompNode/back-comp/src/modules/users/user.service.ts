import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entity/user.entity';
import { getConnection } from 'typeorm';
import { Role } from '../../entity/role.entity';
import { RoleRepository } from '../role/role.repository';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository)
		private readonly _userRepository: UserRepository,
		@InjectRepository(RoleRepository)
		private readonly _roleRepository: RoleRepository,
	) {}

	async getFromUsername(username: string): Promise<User> {
		if (!username) {
			throw new BadRequestException('Username must be sent');
		}

		const user: User = await this._userRepository.findOne(username, {
			where: { status: 'ACTIVE' },
		});

		if (!user) {
			throw new NotFoundException();
		}

		return user;
	}

	async getAll(): Promise<User[]> {
		const users: User[] = await this._userRepository.find({
			where: { status: 'ACTIVE' },
		});

		return users;
	}

	async create(user: User): Promise<User> {
		// const details = new UserDetails();
		// user.details = details;

		const repo = getConnection().getRepository(Role);
		const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
		user.roles = [defaultRole];

		const savedUser: User = await this._userRepository.save(user);
		return savedUser;
	}

	async update(id: number, user: User): Promise<void> {
		await this._userRepository.update(id, user);
	}

	async delete(id: number): Promise<void> {
		const userExist = await this._userRepository.findOne(id, {
			where: { status: 'ACTIVE' },
		});

		if (!userExist) {
			throw new NotFoundException();
		}

		await this._userRepository.update(id, { status: 'INACTIVE' });
	}

	async setRoleToUser(userId: number, roleId: number) {
		const userExist = await this._userRepository.findOne(userId, {
			where: { status: 'ACTIVE' },
		});

		if (!userExist) {
			throw new NotFoundException();
		}

		const roleExist = await this._roleRepository.findOne(roleId, {
			where: { status: 'ACTIVE' },
		});

		if (!roleExist) {
			throw new NotFoundException('Role does not exist');
		}

		userExist.roles.push(roleExist);
		await this._userRepository.save(userExist);

		return true;
	}
}
