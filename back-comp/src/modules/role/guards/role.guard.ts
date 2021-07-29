import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'sharedInterfaces/Entity';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly _reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles: Roles[] = this._reflector.get<Roles[]>('roles', context.getHandler());

		if (!roles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const { user } = request;

		// TODO: feat(role-guard): added functional role guard
		// const hasRole = () => user.roles.some((role: string) => roles.includes(role));

		return user && user.roles /* && hasRole() */;
	}
}
