import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hashSync } from 'bcrypt';
import { UserRepository } from '../users/user.repository';
import { SigninDto, SignupDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from '../role/roletype.enum';
import { User } from 'src/entity';

@Injectable()
export class AuthService {
	constructor(
		private readonly _jwtService: JwtService,
		@InjectRepository(UserRepository) private readonly userRepository: UserRepository,
	) {}

	async signup(signupDto: SignupDto) {
		let usr = signupDto;
		const userExists = await this.userRepository.findOne({
			where: [{ username: usr.username }, { email: usr.email }],
		});
		//TODO: Añadir mismas comprobaciones que en angular, minimo caracteres usuario movil etc.
		if (userExists) {
			console.log('El usuario existe');
			throw new ConflictException('username or email already exists');
		}
		let user = User.buildFromRegister(signupDto);
		user.password = hashSync(user.password, 10);
		console.log(user);
		try {
			await user.save();
			//TODO: Si todo va bien mandar el correo de confirmación al email
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
	async signin(signinDto: SigninDto): Promise<{ token: string }> {
		const errMsg: string = 'Incorrect user or password';
		const { username, password } = signinDto;
		const user: User = await this.userRepository.findOne({
			where: { username },
		});

		if (!user) {
			throw new UnauthorizedException(errMsg);
		}
		if (!user.active) {
			throw new UnauthorizedException('User not verified');
		}
		var isMatch;
		try {
			isMatch = await compare(password, user.password);
		} catch (error) {
			isMatch = false;
		}
		if (!isMatch) {
			throw new UnauthorizedException(errMsg);
		}

		const payload: IJwtPayload = {
			email: user.email,
			username: user.username,
			password: user.password,
			roles: user.roles.map(r => r.name as RoleType),
		};

		const token = this._jwtService.sign(payload);
		return { token };
	}
	/**
	 *	Verifica si el token mandando como string es valido, de ser asi renueva
	 *	la fecha de expiración y de expedición de este
	 * @param tokenStr El jwt como string
	 * @returns Retorna un token con el mismo payload pero distinto exp y iat.
	 */
	async renewToken(tokenStr: string): Promise<{ token: string }> {
		if (!tokenStr || tokenStr == null) {
			return;
		}
		if (!this._jwtService.verify(tokenStr)) {
			return;
		}
		let tokenObj: IJwtPayload = <IJwtPayload>this._jwtService.decode(tokenStr);
		delete tokenObj.iat;
		delete tokenObj.exp;
		const token = this._jwtService.sign(tokenObj);
		return { token };
	}
}
