import { AutoMap } from '@automapper/classes';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateFreelancerDto {
  @AutoMap()
  @IsEmail()
  email: string;

  @AutoMap()
  @IsString()
  bio: string;

  @AutoMap(() => [String])
  @IsOptional()
  skills?: string[];

  @AutoMap(() => [String])
  @IsOptional()
  languages?: string[];
}
