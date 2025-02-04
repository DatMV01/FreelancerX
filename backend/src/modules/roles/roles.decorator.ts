import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from './roles.enum';

export const ROLE_KEY = 'roles';

export const Roles = (...role: RoleEnum[]) => SetMetadata(ROLE_KEY, role);
