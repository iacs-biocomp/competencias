import { Injectable } from '@nestjs/common';
import { JwtVerifyOptions } from '@nestjs/jwt';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard {
	/**
	 * Authentication using JWT
	 * @param token The JWT
	 * @param secret Secret key
	 * @returns `true` if JWT not expired and valid, `false` otherwise
	 */
	public canActivate(token: string | undefined, secret: string): boolean {
		if (!token) {
			return false;
		}
		try {
			verify(token, secret);
		} catch (error) {
			return false;
		}
		return true;
	}
}
class JwtOptions implements JwtVerifyOptions {
	secret: string;
	constructor(secret: string) {
		this.secret = secret;
	}
}
