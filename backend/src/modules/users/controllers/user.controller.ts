import { Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { Roles } from 'sharedInterfaces/Entity';
import { SetRoles } from 'src/decorators/role.decorator';
import { UserDTO } from 'src/DTO/user.DTO';
import { Trabajador, User } from 'src/entity';
import { UserService } from '../services/user.service';

@Controller('api/users')
export class UserController {
	constructor(private readonly _usrSv: UserService) {}

	@Get(':username')
	async getUserUsername(@Param('username') username: string): Promise<UserDTO> {
		// TODO: Repair types
		return this._usrSv.getFromUsername(username) as Promise<UserDTO>;
	}

	@Get('allinfo/:username')
	async getAllUserInfo(@Param('username') username: string): Promise<Trabajador | undefined> {
		return Trabajador.findOne({
			where: { user: username },
			relations: ['periodos', 'periodos.superiores', 'periodos.inferiores', 'periodos.pares'],
		});
	}

	@Post()
	async createUser(@Body() user: User): Promise<User> {
		return this._usrSv.create(user);
	}

	// @SetRoles(Roles.ADMIN)
	@Patch(':id')
	async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
		//TODO: Terminar el metodo
		return this._usrSv.update(id, user);
	}

	@SetRoles(Roles.ADMIN)
	@Delete(':id')
	async deleteUser(@Param('id', ParseIntPipe) id: number) {
		//TODO: Terminar el metodo
		await this._usrSv.delete(id);
		return true;
	}

	@SetRoles(Roles.ADMIN)
	@Post('setRole/:userId/:roleId')
	async setRoleToUser(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) roleId: number) {
		return this._usrSv.setRoleToUser(userId, roleId);
	}
}
