import { AutoMap } from '@automapper/classes';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @AutoMap()
  @IsNotEmpty()
  user: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @AutoMap()
  @IsNotEmpty()
  @IsString()
  message: string;
}
