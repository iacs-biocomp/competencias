import { Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { Trabajador, User } from 'src/entity';
import { UserService } from './user.service';

@Controller('nest/users')
export class UserController {
	constructor(private readonly _userService: UserService) {}

	@Get(':username')
	async getUserUsername(@Param('username') username: string): Promise<User> {
		return this._userService.getFromUsername(username);
	}
	@Get('allinfo/:username')
	async getAllUserInfo(@Param('username') username: string): Promise<Trabajador> {
		return 	Trabajador.findOne({
			where: { user: username },
			relations: ['periodos', 'periodos.superiores', 'periodos.inferiores', 'periodos.pares'],
		});
	}
	// @UseGuards(AuthGuard())
	// @Get()
	// async getUsers(): Promise<User[]> {
	// 	const users = await this._userService.getAll();
	// 	return users;
	// }

	@Post()
	async createUser(@Body() user: User): Promise<User> {
		return this._userService.create(user);
	}

	@Patch(':id')
	async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
		//TODO: Terminar el metodo
		return this._userService.update(id, user);
	}

	@Delete(':id')
	async deleteUser(@Param('id', ParseIntPipe) id: number) {
		//TODO: Terminar el metodo
		await this._userService.delete(id);
		return true;
	}

	@Post('setRole/:userId/:roleId')
	async setRoleToUser(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) roleId: number) {
		return this._userService.setRoleToUser(userId, roleId);
	}
}
