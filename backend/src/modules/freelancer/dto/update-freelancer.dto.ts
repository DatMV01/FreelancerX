import { PartialType } from '@nestjs/mapped-types';
import { CreateFreelancerDto } from './create-freelancer.dto';
import { FreelancerRankEnum } from '../enum/freelancer.enum';

export class UpdateFreelancerDto extends PartialType(CreateFreelancerDto) {
  level: FreelancerRankEnum;
}
