import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { SellerRankStatus } from '../enum/seller.rank.enum';

@Entity('seller')
export class SellerEntity extends BaseEntity {
  @AutoMap()
  @PrimaryColumn('uuid') // ID sẽ là FK từ UserEntity và là PK của SellerEntity
  id: string;

  @AutoMap(() => UserEntity)
  @OneToOne(() => UserEntity, (user) => user.sellerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id' })
  user: UserEntity;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: SellerRankStatus,
    default: SellerRankStatus.new,
  })
  sellerLevel: 'new' | 'level1' | 'level2' | 'level3';

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  about?: string;

  @AutoMap(() => [String])
  @Column({ type: 'simple-array', nullable: true })
  skills?: string[];

  @AutoMap(() => [String])
  @Column({ type: 'simple-array', nullable: true })
  languages?: string[];

  @AutoMap()
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  rating: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  completedOrders: number;

  @AutoMap()
  @Column({ type: 'int', nullable: true })
  responseTime?: number;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: ['available', 'busy', 'offline'],
    default: 'available',
  })
  availability: 'available' | 'busy' | 'offline';

  @AutoMap()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  earnings: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  withdrawnAmount: number;

  @AutoMap(() => [GigEntity])
  @OneToMany(() => GigEntity, (gig) => gig.seller)
  gigs: GigEntity[];

  @AutoMap(() => [OrderEntity])
  @OneToMany(() => OrderEntity, (order) => order.seller)
  sellerOrders: OrderEntity[];

  @BeforeInsert()
  beforeInsert() {
    if (this.user && typeof this.user === 'string') {
      this.id = this.user as any;
    }
  }
}
