import { SetMetadata } from '@nestjs/common';
import { Roles } from 'sharedInterfaces/Entity';

export const SetRoles = (...roles: Roles[]) => SetMetadata('roles', roles);
