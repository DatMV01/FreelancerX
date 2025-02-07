import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { ReviewEntity } from 'src/modules/review/entities/review.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GigStatus } from '../enum/gig.status';

@Entity({ name: 'gig' })
export class GigEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @AutoMap()
  @Column({ type: 'text' })
  description: string;

  @AutoMap()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string;

  @AutoMap()
  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @AutoMap()
  @Column({ type: 'enum', enum: GigStatus, default: GigStatus.PENDING })
  status: GigStatus;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  ordersCompleted: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  ordersInProgress: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  rating: number;

  @AutoMap()
  @Column({ type: 'uuid' })
  sellerId: string;

  @AutoMap()
  @ManyToOne(() => UserEntity, (user) => user.gigs)
  seller: UserEntity;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @AutoMap()
  @ManyToOne(() => CategoryEntity, (category) => category.gigs)
  category: CategoryEntity;

  @AutoMap()
  @OneToMany(() => OrderEntity, (order) => order.gig)
  orders: OrderEntity[];

  @AutoMap()
  @OneToMany(() => ReviewEntity, (review) => review.buyer)
  reviews: ReviewEntity[];
}
