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

interface PricingPackage {
  name: string;
  description: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  extras?: { package: string; value: string }[];
}

interface Media {
  thumbnail: string;
  gallery: string[];
  video?: string;
}

interface Requirement {
  type: 'text' | 'file' | 'multiple_choice';
  question: string;
  options?: string[];
  required: boolean;
}

@Entity({ name: 'gig' })
export class GigEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  language?: string;

  @AutoMap()
  @Column({ type: 'enum', enum: GigStatus, default: GigStatus.DRAFT })
  status: GigStatus;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string;

  @AutoMap()
  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @AutoMap()
  @Column({ type: 'float', default: 0 })
  basicPrice: number;

  @AutoMap()
  @Column({ type: 'float', default: 0 })
  standardPrice: number;

  @AutoMap()
  @Column({ type: 'float', default: 0 })
  premiumPrice: number;

  @Column({ type: 'json', nullable: true })
  pricing: {
    basic: PricingPackage;
    standard?: PricingPackage;
    premium?: PricingPackage;
  };

  @Column({ type: 'json', nullable: true })
  media?: Media;

  @Column({ type: 'json', nullable: true })
  requirements: Requirement[];

  @Column({ type: 'float', default: 0 })
  ratingAverage: number = 0;

  @Column({ type: 'int', default: 0 })
  ratingCount: number = 0;

  @Column({ type: 'int', default: 0 })
  popularity: number = 0;

  @Column({ type: 'simple-array', nullable: true })
  searchKeywords: string[];

  @Column({ type: 'boolean', default: false })
  isPromoted: boolean = false;

  @Column({ type: 'int', default: 0 })
  views: number = 0;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  rating: number;

  @AutoMap()
  @Column({ type: 'uuid' })
  sellerId: string;

  @AutoMap()
  @ManyToOne(() => UserEntity, (user) => user.gigs)
  seller: UserEntity;

  /* === */
  @AutoMap()
  @ManyToOne(() => CategoryEntity, (category) => category.gigs)
  category: CategoryEntity;

  /* === */

  /* === */

  @AutoMap()
  @ManyToOne(() => CategoryEntity, (category) => category.gigs)
  subCategory: CategoryEntity;
  /* === */

  /* === */

  @AutoMap()
  @ManyToOne(() => CategoryEntity, (category) => category.gigs, {
    nullable: true,
  })
  nestedSubcategory: CategoryEntity;
  /* === */

  /* === */

  @AutoMap()
  @OneToMany(() => OrderEntity, (order) => order.gig)
  orders: OrderEntity[];
  /* === */

  /* === */
  @AutoMap()
  @OneToMany(() => ReviewEntity, (review) => review.buyer)
  reviews: ReviewEntity[];
}
