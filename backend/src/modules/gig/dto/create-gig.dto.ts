import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
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
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from 'src/modules/user/dto/user.dto';

export class CreateGigDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsOptional()
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
  pricing: PricingPackage[];

  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @IsOptional()
  faqs?: FAQ[];

  @IsOptional()
  images: GigImages;

  @IsOptional()
  documents: GigDocuments;

  @IsOptional()
  video: GigFileInfo;

  @IsEnum(GigStatus)
  @IsOptional()
  status: GigStatus = GigStatus.DRAFT;

  @IsOptional()
  thumbnail?: GigFileInfo | null;

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
