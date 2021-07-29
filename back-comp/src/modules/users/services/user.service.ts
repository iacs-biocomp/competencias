import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { User, Role } from 'src/entity';
import { IUserDTO } from 'sharedInterfaces/DTO';
import { UserRepository } from '../user.repository';
import { RoleRepository } from 'src/modules/role/role.repository';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserRepository)
		private readonly usrRepo: UserRepository,
		@InjectRepository(RoleRepository)
		private readonly roleRepo: RoleRepository,
	) {}

	async getFromUsername(username: string): Promise<IUserDTO> {
		const user = await this.usrRepo.findOne(username, {
			where: { active: true },
		});

		if (!user) {
			throw new NotFoundException();
		}
		// TODO: Corregir error as unknown
		return user as unknown as IUserDTO;
	}

	async getAll(): Promise<IUserDTO[]> {
		const users: User[] = await this.usrRepo.find({
			where: { active: true },
		});
		// TODO: Corregir error as unknown
		return users as unknown as IUserDTO[];
	}

	async create(user: User): Promise<User> {
		// const details = new UserDetails();
		// user.details = details;

		const repo = getConnection().getRepository(Role);
		const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
		if (!defaultRole) {
			throw new NotFoundException('Genral role not found, contact an administrator');
		}
		user.roles = [defaultRole];

		return this.usrRepo.save(user);
	}

	async update(id: number, user: User): Promise<void> {
		await this.usrRepo.update(id, user);
	}

	async delete(id: number): Promise<void> {
		const userExist = await this.usrRepo.findOne(id, {
			where: { active: true },
		});

		if (!userExist) {
			throw new NotFoundException();
		}

		await this.usrRepo.update(id, { active: true });
	}

	async setRoleToUser(userId: number, roleId: number) {
		const userExist = await this.usrRepo.findOne(userId, {
			where: { active: true },
		});

		if (!userExist) {
			throw new NotFoundException();
		}

		const roleExist = await this.roleRepo.findOne(roleId, {
			where: { active: true },
		});

		if (!roleExist) {
			throw new NotFoundException('Role does not exist');
		}

		userExist.roles.push(roleExist);
		await this.usrRepo.save(userExist);

		return true;
	}
}
