import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  FAQ,
  GigDocuments,
  GigFileInfo,
  GigImages,
  PricingPackage,
  Requirement,
} from '../dto/gig.dto';
import { GigStatus } from '../enum/gig.status';
import { AutoMap } from '@automapper/classes';

export class GigFreelancerDto {
  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  id?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  email?: string;
}

export class CreateGigDto {
  @AutoMap()
  @IsString()
  @IsOptional()
  @ApiProperty()
  id?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  userId?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  freelancerId?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  categoryId: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  subCategoryId: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  nestedSubcategoryId: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  category: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  subCategory: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  nestedSubcategory: string;

  @AutoMap(() => [String])
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @AutoMap()
  @IsNumber()
  @Min(0)
  @IsOptional()
  basicPrice?: number;

  @AutoMap()
  @IsNumber()
  @Min(0)
  @IsOptional()
  standardPrice?: number;

  @AutoMap()
  @IsNumber()
  @Min(0)
  @IsOptional()
  premiumPrice?: number;

  @AutoMap(() => [PricingPackage])
  @IsOptional()
  pricingPackage: PricingPackage[];

  @AutoMap()
  @IsString()
  @IsOptional()
  description: string;

  @AutoMap(() => [FAQ])
  @IsArray()
  @IsOptional()
  faqs?: FAQ[];

  @AutoMap(() => GigImages)
  @IsOptional()
  images: GigImages;

  @AutoMap(() => GigDocuments)
  @IsOptional()
  documents: GigDocuments;

  @AutoMap(() => GigFileInfo)
  @IsOptional()
  video: GigFileInfo;

  @AutoMap()
  @IsEnum(GigStatus)
  @IsOptional()
  status: GigStatus = GigStatus.DRAFT;

  @AutoMap(() => GigFileInfo)
  @IsOptional()
  thumbnail?: GigFileInfo | null;

  @AutoMap(() => [Requirement])
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

  @AutoMap(() => GigFreelancerDto)
  @IsOptional()
  @ValidateNested()
  @Type(() => GigFreelancerDto)
  @ApiProperty({ type: () => GigFreelancerDto, required: false })
  freelancer?: GigFreelancerDto;

  @AutoMap()
  @IsOptional()
  slug: string;
}
