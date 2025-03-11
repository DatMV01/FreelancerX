import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
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
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/modules/users/dto/user.dto';

export class CreateGigDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  id?: string;

  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  subCategory: string;

  @IsOptional()
  @IsString()
  nestedSubcategory?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  basicPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  standardPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  premiumPrice: number;

  @IsOptional()
  pricing?: {
    basic?: PricingPackage;
    standard?: PricingPackage;
    premium?: PricingPackage;
  };

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  faqs?: FAQ[];

  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @ArrayMaxSize(3)
  images: string[];

  @IsString()
  @IsOptional()
  video: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(2)
  documents: string[];

  @IsEnum(GigStatus)
  @IsOptional()
  status: GigStatus = GigStatus.DRAFT;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => Requirement)
  requirements: Requirement[];

  // @IsOptional()
  // @IsNumber()
  // @Min(0)
  // @Max(5)
  // @ApiProperty()
  // avgRating?: number;

  // @IsOptional()
  // @IsNumber()
  // @ApiProperty()
  // totalReviews?: number;
  @IsOptional()
  @IsString()
  @ApiProperty()
  sellerId: string;

  @IsOptional()
  @ApiProperty()
  seller: UserDto;
  
  @IsOptional()
  slug: string;
}
