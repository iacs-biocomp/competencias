import { Controller, Post, Body, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { SigninDTO, SignupDTO } from 'src/DTO/auth';
import { AuthService } from '../services/auth.service';

@Controller('nest')
export class AuthController {
	constructor(
		private readonly _authService: AuthService, // private kCloak: KeycloakService,
	) {}

	@Post('signup')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async signup(@Body() signupDto: SignupDTO) {
		return this._authService.signup(signupDto);
	}

	@Post('signin')
	@UsePipes(new ValidationPipe({ transform: true, transformOptions: { excludeExtraneousValues: true } }))
	async signin(@Body() signinDto: SigninDTO) {
		return this._authService.signin(signinDto);
	}

	@Post('jwtrefresh')
	async jwtRefresh(@Body() tokenJson: { tokenStr: string }) {
		const tokenStr = tokenJson.tokenStr;
		if (!tokenStr || tokenStr == null) {
			throw new BadRequestException('El token mandado es null o undefined');
		}
		return this._authService.renewToken(tokenStr);
	}
}
