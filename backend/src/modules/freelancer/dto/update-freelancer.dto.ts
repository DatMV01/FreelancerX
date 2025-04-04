import { AutoMap } from '@automapper/classes';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FreelancerRankEnum } from '../enum/freelancer.enum';
import { CreateFreelancerDto } from './create-freelancer.dto';

export class UpdateFreelancerDto extends PartialType(CreateFreelancerDto) {
  @AutoMap()
  @IsEnum(FreelancerRankEnum)
  @IsOptional()
  @ApiPropertyOptional({
    example: FreelancerRankEnum.LEVEL1,
    enum: FreelancerRankEnum,
    enumName: 'FreelancerRankEnum',
    description: 'Freelancer level, e.g., LEVEL1, LEVEL2, etc.',
  })
  level?: FreelancerRankEnum;
}
