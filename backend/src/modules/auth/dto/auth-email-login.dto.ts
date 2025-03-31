import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/index.transformer';

export class AuthEmailLoginDto {
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @ApiProperty({ default: 'admin@example.com' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ default: 'user123' })
  password: string;
}
