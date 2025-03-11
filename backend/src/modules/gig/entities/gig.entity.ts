import { AutoMap } from '@automapper/classes';
import { Max, Min } from 'class-validator';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import { ReviewEntity } from 'src/modules/review/entities/review.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FAQ, Pricing, Requirement } from '../dto/gig.dto';
import { GigStatus } from '../enum/gig.status';

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
  @JoinColumn({ referencedColumnName: 'slug' })
  category: CategoryEntity;

  @AutoMap()
  @ManyToOne(() => CategoryEntity, (category) => category.gigs)
  @JoinColumn({ referencedColumnName: 'slug' })
  subCategory: CategoryEntity;

  @AutoMap()
  @ManyToOne(() => CategoryEntity, (category) => category.gigs, {
    nullable: true,
  })
  @JoinColumn({ referencedColumnName: 'slug' })
  nestedSubcategory: CategoryEntity;

  @AutoMap(() => String)
  @Column({ type: 'simple-array', nullable: true })
  tags: string[];
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

  @AutoMap(() => Pricing)
  @Column({ type: 'json', nullable: true })
  pricing: Pricing;
  /* Pricing */

  /* Description & FAQ */
  @AutoMap()
  @Column({ type: 'longtext', nullable: true })
  description: string;

  @AutoMap(() => FAQ)
  @Column({ type: 'json', nullable: true })
  faqs?: FAQ[];
  /* Description & FAQ */

  /* Gallery */
  @AutoMap(() => String)
  @Column({ type: 'simple-array', nullable: true })
  images?: string[];

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  video: string;

  @AutoMap(() => String)
  @Column({ type: 'simple-array', nullable: true })
  documents?: string[];
  /* Gallery */

  @AutoMap()
  @Column({ type: 'enum', enum: GigStatus, default: GigStatus.DRAFT })
  status: GigStatus;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail?: string;

  @AutoMap(() => Requirement)
  @Column({ type: 'json', nullable: true })
  requirements?: Requirement[];

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

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.gigs)
  seller: UserEntity;

  @AutoMap()
  @OneToMany(() => OrderEntity, (order) => order.gig)
  orders: OrderEntity[];

  @AutoMap()
  @OneToMany(() => ReviewEntity, (review) => review.buyer)
  reviews: ReviewEntity[];

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: false })
  slug: string;
}
