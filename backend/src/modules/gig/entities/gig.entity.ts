import { AutoMap } from '@automapper/classes';
import { Max, Min } from 'class-validator';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import { ReviewEntity } from 'src/modules/review/entities/review.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  FAQ,
  GigDocuments,
  GigFileInfo,
  GigImages,
  PricingPackage,
  Requirement,
} from '../dto/gig.dto';
import { GigStatus } from '../enum/gig.status';
import { SellerEntity } from 'src/modules/seller/entities/seller.entity';

@Entity({ name: 'gig' })
export class GigEntity extends BaseEntity {
  /* Overview */
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @AutoMap(() => CategoryEntity)
  @ManyToOne(() => CategoryEntity, (category) => category.gigs, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ referencedColumnName: 'slug' })
  category: CategoryEntity | null;

  @AutoMap(() => CategoryEntity)
  @ManyToOne(() => CategoryEntity, (category) => category.gigs, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ referencedColumnName: 'slug' })
  subCategory: CategoryEntity | null;

  @AutoMap(() => CategoryEntity)
  @ManyToOne(() => CategoryEntity, (category) => category.gigs, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ referencedColumnName: 'slug' })
  nestedSubcategory: CategoryEntity | null;

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

  @AutoMap(() => PricingPackage)
  @Column({ type: 'json', nullable: true })
  pricing: PricingPackage[];
  /* Pricing */

  /* Description & FAQ */
  @AutoMap()
  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  @AutoMap(() => FAQ)
  @Column({ type: 'json', nullable: true })
  faqs?: FAQ[];
  /* Description & FAQ */

  /* Gallery */
  @AutoMap(() => GigImages)
  @Column({ type: 'json', nullable: true })
  images?: GigImages | null;

  @AutoMap(() => GigDocuments)
  @Column({ type: 'json', nullable: true })
  documents?: GigDocuments | null;

  @AutoMap(() => GigFileInfo)
  @Column({ type: 'json', nullable: true })
  video?: GigFileInfo;

  /* Gallery */

  @AutoMap()
  @Column({ type: 'enum', enum: GigStatus, default: GigStatus.DRAFT })
  status: GigStatus;

  @AutoMap(() => GigFileInfo)
  @Column({ type: 'json', nullable: true })
  thumbnail?: GigFileInfo | null;

  @AutoMap(() => Requirement)
  @Column({ type: 'json', nullable: true })
  requirements?: Requirement[];

  @AutoMap()
  @Column({ type: 'float', default: 0 })
  avgRating: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @AutoMap(() => RatingEntity)
  @OneToMany(() => RatingEntity, (rating) => rating.gig, { cascade: true })
  ratings: RatingEntity[];

  // @Column({ type: 'int', default: 0 })
  // popularity: number = 0;

  // @Column({ type: 'boolean', default: false })
  // isPromoted: boolean = false;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  views: number;

  @AutoMap(() => SellerEntity)
  @ManyToOne(() => SellerEntity, (seller) => seller.gigs, {
    eager: true,
  })
  @JoinColumn({ name: 'seller_id' })
  seller: SellerEntity;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  orderCount: number;

  @AutoMap()
  @OneToMany(() => OrderEntity, (order) => order.gig)
  orders: OrderEntity[];

  @AutoMap()
  @OneToMany(() => ReviewEntity, (review) => review.buyer)
  reviews: ReviewEntity[];

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: false })
  slug: string;

  @BeforeInsert()
  beforeInsert() {
    this.slug = `${this.title.trim().toLowerCase().replaceAll(' ', '-')}-${Date.now()}`;

    this.updateAllCategory();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updateAllCategory();
  }

  updateAllCategory() {
    this.category = (this.category as any) === '' ? null : this.category;

    this.subCategory =
      (this.subCategory as any) === '' ? null : this.subCategory;

    this.nestedSubcategory =
      (this.nestedSubcategory as any) === '' ? null : this.nestedSubcategory;

    if (!this.images?.image1 && !this.images?.image2 && !this.images?.image3) {
      this.images = null;
    }

    if (this.images?.image1) {
      this.thumbnail = this.images?.image1;
    }

    if (!this.documents?.document1 && !this.documents?.document2) {
      this.documents = null;
    }
  }
}
