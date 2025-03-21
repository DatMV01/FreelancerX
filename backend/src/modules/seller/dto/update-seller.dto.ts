import { PartialType } from '@nestjs/mapped-types';
import { CreateSellerDto } from './create-seller.dto';

export class UpdateSellerDto extends PartialType(CreateSellerDto) {
  sellerLevel: 'new' | 'level1' | 'level2' | 'level3';
}
