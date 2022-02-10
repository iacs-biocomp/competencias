import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '../../../config/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly _configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'eeee',
		});
	}

	async validate(payload) {
		// const { username } = payload;
		// const user = await this._authRepository.findOne({
		//   where: { username, status: 'ACTIVE' },
		// });

		// if (!user) {
		//   throw new UnauthorizedException();
		// }
		return payload;
	}
}
