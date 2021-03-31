import {
	Controller,
	Get,
	Param,
	Post,
	Body,
	Patch,
	Delete,
	ParseIntPipe,
	UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../entity/user.entity';
import { Trabajador } from '../../entity/Trabajador.entity';

@Controller('nest/users')
export class UserController {
	constructor(private readonly _userService: UserService) {}

	@Get(':username')
	async getUserUsername(@Param('username') username: string): Promise<User> {
		const users = await this._userService.getFromUsername(username);
		return users;
	}
	@Get('allinfo/:username')
	async getAllUserInfo(
		@Param('username') username: string,
	): Promise<Trabajador> {
		var worker = await Trabajador.findOne({
			where: { user: username },
			relations: ['superiores', 'inferiores', 'pares'],
		});

		return worker;
	}
	// @UseGuards(AuthGuard())
	// @Get()
	// async getUsers(): Promise<User[]> {
	// 	const users = await this._userService.getAll();
	// 	return users;
	// }

	@Post()
	async createUser(@Body() user: User): Promise<User> {
		const createdUser = await this._userService.create(user);
		return createdUser;
	}

	@Patch(':id')
	async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
		const updatedUser = await this._userService.update(id, user);
		return true;
	}

	@Delete(':id')
	async deleteUser(@Param('id', ParseIntPipe) id: number) {
		await this._userService.delete(id);
		return true;
	}

	@Post('setRole/:userId/:roleId')
	async setRoleToUser(
		@Param('userId', ParseIntPipe) userId: number,
		@Param('roleId', ParseIntPipe) roleId: number,
	) {
		return this._userService.setRoleToUser(userId, roleId);
	}
}
