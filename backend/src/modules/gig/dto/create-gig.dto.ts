import { AutoMap } from '@automapper/classes';
import { Type } from 'class-transformer';
import {
     IsArray,
     IsEnum,
     IsNumber,
     IsOptional,
     IsString,
     Max,
     Min,
     ValidateNested,
} from 'class-validator';
import { FAQ, PricingPackage, Requirement } from '../dto/gig.dto';
import { GigStatus } from '../enum/gig.status';

export class CreateGigDto {
  @AutoMap()
  @IsString()
  title: string;

  @AutoMap()
  @IsString()
  categoryId: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  subCategoryId?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  nestedSubcategoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchTags?: string[];

  @AutoMap()
  @IsNumber()
  @Min(0)
  basicPrice: number;

  @AutoMap()
  @IsNumber()
  @Min(0)
  standardPrice: number;

  @AutoMap()
  @IsNumber()
  @Min(0)
  premiumPrice: number;

  @AutoMap()
  @ValidateNested()
  @Type(() => PricingPackage)
  pricing: {
    basic: PricingPackage;
    standard?: PricingPackage;
    premium?: PricingPackage;
  };

  @AutoMap()
  @IsString()
  description: string;

  @AutoMap()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FAQ)
  faqs: FAQ[];

  @AutoMap()
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @AutoMap()
  @IsString()
  video: string;

  @AutoMap()
  @IsArray()
  @IsString({ each: true })
  documents: string[];

  @AutoMap()
  @IsEnum(GigStatus)
  status: GigStatus;

  @AutoMap()
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @AutoMap()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Requirement)
  requirements: Requirement[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  avgRating?: number;

  @IsOptional()
  @IsNumber()
  totalReviews?: number;

  @AutoMap()
  @IsString()
  sellerId: string;
}
