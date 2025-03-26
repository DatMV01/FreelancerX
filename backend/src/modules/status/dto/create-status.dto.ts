import { AutoMap } from '@automapper/classes';
import { Allow, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStatusDto {
  @AutoMap()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @IsOptional()
  description?: string;
}
