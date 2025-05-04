import { AutoMap } from '@automapper/classes';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSupportDto {
  @AutoMap()
  @IsEmail()
  email: string;

  @AutoMap()
  @IsNotEmpty()
  subject: string;

  @AutoMap()
  @IsNotEmpty()
  message: string;
}
