import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsOptional()
  description?: string;
}
