import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { SellerEntity } from './entities/seller.entity';
 

@Injectable()
export class SellerService extends BaseService<SellerEntity> {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly _repository: Repository<SellerEntity>,
  ) {
    super(_repository);
  }
}
