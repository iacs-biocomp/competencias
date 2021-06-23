import { Controller, Post, Body, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { SignupDto, SigninDto } from './dto';
import { AuthService } from './auth.service';

@Controller('nest')
export class AuthController {
	constructor(
		private readonly _authService: AuthService, // private kCloak: KeycloakService,
	) {}

	@Post('signup')
	// @UsePipes(ValidationPipe)
	async signup(@Body() signupDto: SignupDto) {
		return this._authService.signup(signupDto);
	}

	@Post('signin')
	@UsePipes(ValidationPipe)
	async signin(@Body() signinDto: SigninDto) {
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
