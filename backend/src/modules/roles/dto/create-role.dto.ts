import { AutoMap } from '@automapper/classes';
import { Allow, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @Allow()
  @IsNotEmpty()
  name: string;

  @Allow()
  description?: string;
}
