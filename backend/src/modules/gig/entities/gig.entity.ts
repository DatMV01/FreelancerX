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
import { FAQ, Media, PricingPackage, Requirement } from '../dto/gig.dto';
import { Max, Min } from 'class-validator';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';

@Entity({ name: 'gig' })
export class GigEntity extends BaseEntity {
  /* Overview */
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @AutoMap()
  @ManyToOne(() => CategoryEntity, (category) => category.gigs)
  category: CategoryEntity;

  @AutoMap()
  @ManyToOne(() => CategoryEntity, (category) => category.gigs)
  subCategory: CategoryEntity;

  @AutoMap()
  @ManyToOne(() => CategoryEntity, (category) => category.gigs, {
    nullable: true,
  })
  nestedSubcategory: CategoryEntity;

  @Column({ type: 'simple-array', nullable: true })
  searchTags: string[];
  /* Overview */

  /* Pricing */
  @AutoMap()
  @Column({ type: 'float', default: 0 })
  basicPrice: number;

  @AutoMap()
  @Column({ type: 'float', default: 0 })
  standardPrice: number;

  @AutoMap()
  @Column({ type: 'float', default: 0 })
  premiumPrice: number;

  @AutoMap()
  @Column({ type: 'json' })
  pricing: {
    basic: PricingPackage;
    standard?: PricingPackage;
    premium?: PricingPackage;
  };
  /* Pricing */

  /* Description & FAQ */
  @AutoMap()
  @Column({ type: 'text' })
  description: string;

  @AutoMap()
  @Column({ type: 'json' })
  faqs: FAQ[];
  /* Description & FAQ */

  /* Gallery */
  @AutoMap()
  @Column({ type: 'simple-array' })
  images: string[];

  @AutoMap()
  @Column({ type: 'varchar', length: 255 })
  video: string;

  @AutoMap()
  @Column({ type: 'simple-array' })
  documents: string[];
  /* Gallery */

  @AutoMap()
  @Column({ type: 'enum', enum: GigStatus, default: GigStatus.DRAFT })
  status: GigStatus;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string;

  @Column({ type: 'json', nullable: true })
  requirements: Requirement[];

  @Column({ type: 'float', default: 0 })
  @Min(0)
  @Max(5)
  avgRating: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @OneToMany(() => RatingEntity, (rating) => rating.gig, { cascade: true })
  ratings: RatingEntity[];

  // @Column({ type: 'int', default: 0 })
  // popularity: number = 0;

  // @Column({ type: 'boolean', default: false })
  // isPromoted: boolean = false;

  @Column({ type: 'int', default: 0 })
  @Min(0)
  views: number = 0;

  @AutoMap()
  @ManyToOne(() => UserEntity, (user) => user.gigs)
  seller: UserEntity;

  @AutoMap()
  @OneToMany(() => OrderEntity, (order) => order.gig)
  orders: OrderEntity[];

  @AutoMap()
  @OneToMany(() => ReviewEntity, (review) => review.buyer)
  reviews: ReviewEntity[];
}
