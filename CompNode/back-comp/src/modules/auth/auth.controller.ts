import {
	Controller,
	Post,
	Body,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
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
		// return false;
		return await this._authService.signup(signupDto);
	}

	@Post('signin')
	@UsePipes(ValidationPipe)
	async signin(@Body() signinDto: SigninDto) {
		// return this._authService.signin(signinDto);
		return await this._authService.signin(signinDto);
	}
	// @Get('testt')
	// async test() {
	//   return this.kCloak.test();
	// }
}
