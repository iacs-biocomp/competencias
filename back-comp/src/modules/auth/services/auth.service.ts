import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity';
import { Roles } from 'sharedInterfaces/Entity';
import { SigninDTO, SignupDTO } from 'src/DTO/auth';
import { IJwtPayload } from 'sharedInterfaces/DTO';
import { UserRepository } from 'src/modules/users/user.repository';
import { deleteProps } from 'sharedCode/Utility';

@Injectable()
export class AuthService {
	constructor(
		private readonly _jwtService: JwtService,
		@InjectRepository(UserRepository) private readonly userRepository: UserRepository,
	) {}

	async signup(signupDto: SignupDTO): Promise<boolean> {
		const usr = signupDto;
		const userExists = await this.userRepository.findOne({
			where: [{ username: usr.username }, { email: usr.email }],
		});
		if (userExists) {
			console.log('El usuario existe');
			throw new ConflictException('username or email already exists');
		}
		let user = User.buildFromRegister(signupDto);
		user.password = hashSync(user.password, 10);
		console.log(user);
		try {
			await user.save();
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	/**
	 *
	 * @param signinDto JSON with credentials
	 * @returns
	 */
	async signin(signinDto: SigninDTO): Promise<{ token: string }> {
		const errMsg: string = 'Incorrect user or password';
		const { username, password } = signinDto;
		const user = await this.userRepository.findOne({
			where: { username },
		});
		if (!user) {
			throw new UnauthorizedException(errMsg);
		}
		if (!user.active) {
			throw new UnauthorizedException('User not verified');
		}
		try {
			await compare(password, user.password);
		} catch (error) {
			throw new UnauthorizedException(errMsg);
		}

		const payload: Omit<IJwtPayload, 'iat' | 'exp'> = {
			email: user.email ?? 'no-email',
			username: user.username,
			password: user.password,
			roles: user.roles.map(r => r.name as Roles),
		};

		const token = this._jwtService.sign(payload);
		return { token };
	}
	/**
	 *	Verifica si el token mandando como string es valido, de ser asi renueva
	 *	la fecha de expiración y de expedición de este
	 * @param tokenStr El jwt como string
	 * @returns Retorna un token con el mismo payload pero distinto exp y iat.
	 * @throws {ForbiddenException}
	 */
	async renewToken(tokenStr: string): Promise<{ token: string }> {
		if (!this._jwtService.verify(tokenStr)) {
			throw new ForbiddenException('El token no es valido o ya ha expirado');
		}
		let tokenObj: IJwtPayload = this._jwtService.decode(tokenStr) as IJwtPayload;
		deleteProps(tokenObj, ['iat', 'exp']);
		const token = this._jwtService.sign(tokenObj);
		return { token };
	}
}
