import { AutoMap } from '@automapper/classes';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateFreelancerDto {
  @AutoMap()
  @IsEmail()
  email: string;

  @AutoMap()
  @IsString()
  about: string;

  @AutoMap()
  @IsOptional()
  skills?: string[];

  @AutoMap()
  @IsOptional()
  languages?: string[];
}
