import { OmitType, PartialType } from '@nestjs/mapped-types';
import { BaseDto } from './base.dto';

export class CreateBaseDto extends OmitType(BaseDto, [
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {}
