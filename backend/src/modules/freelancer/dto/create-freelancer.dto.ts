import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SkillEntity } from '../entities/freelancers_skills.entity';
import { LanguageEntity } from '../entities/freelancers_languages.entity';

export class CreateFreelancerDto {
  @AutoMap()
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  userId?: string;

  @AutoMap()
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'freelancer@example.com',
    description: 'Freelancer email address',
  })
  email?: string;

  @AutoMap()
  @IsString()
  @ApiProperty({
    example: 'Experienced web developer specialized in JavaScript.',
    description: 'Freelancer biography',
  })
  bio: string;

  // @AutoMap(() => [String])
  // @IsOptional()
  // @ApiPropertyOptional({
  //   type: [String],
  //   example: ['JavaScript', 'React', 'Node.js'],
  //   description: 'List of skills the freelancer possesses',
  // })
  // skills?: string[];

  @AutoMap(() => [String])
  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    type: [String],
    example: ['English', 'French', 'Spanish'],
    description: 'Languages spoken by the freelancer',
  })
  languages?: LanguageEntity[] | string[];

  @AutoMap(() => [String])
  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    type: [String],
    example: ['JavaScript', 'React', 'Node.js'],
    description: 'Skills possessed by the freelancer',
  })
  skills?: SkillEntity[] | string[];
}
