import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from './enum/role.enum';

export const ROLE_KEY = 'roles';

export const Roles = (...role: RoleEnum[]) => SetMetadata(ROLE_KEY, role);
