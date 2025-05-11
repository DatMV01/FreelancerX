import { AutoMap } from '@automapper/classes';
import * as removeAccents from 'remove-accents';
import slugify from 'slugify';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

import { GigReviewEntity } from 'src/modules/gigreview/entities/gigreview.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
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
} from '../dto/gig.dto';
import { GigStatus } from '../enum/gig.status';
import { GigPackagesEntity, GigPackageType } from './gig_packages.entity';
import { UserFavoriteGigEntity } from 'src/modules/gig/entities/user_favorite_gigs.entity';

@Entity('gig_tags')
export class GigTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 100 })
  keyword: string;

  @Column({ default: 0 })
  searchCount: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('gigs')
@Index('IDX_gig_fulltext', ['title'], { fulltext: true })
export class GigEntity extends BaseEntity {
  /* Overview */
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 255 })
  title: string;

  /**== Category ==*/
  @AutoMap()
  @Index()
  @Column({
    name: 'category_id',
    nullable: true,
    type: 'char',
    length: 36,
  })
  categoryId: string;

  @AutoMap(() => CategoryEntity)
  @ManyToOne(() => CategoryEntity, (category) => category.gigs, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  /**== SubCategory ==*/
  @AutoMap()
  @Index()
  @Column({
    name: 'sub_category_id',
    nullable: true,
    type: 'char',
    length: 36,
  })
  subCategoryId: string;

  @AutoMap(() => CategoryEntity)
  @ManyToOne(() => CategoryEntity, (category) => category.gigs, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: CategoryEntity;

  /**== NestedSubCategory ==*/
  @AutoMap()
  @Index()
  @Column({
    name: 'nested_sub_category_id',
    nullable: true,
    type: 'char',
    length: 36,
  })
  nestedSubcategoryId: string;

  @AutoMap(() => CategoryEntity)
  @ManyToOne(() => CategoryEntity, (category) => category.gigs, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'nested_sub_category_id' })
  nestedSubcategory: CategoryEntity;

  /**== Freelancer ==*/
  @AutoMap()
  @Column({
    name: 'freelancer_id',
    nullable: true,
    type: 'char',
    length: 36,
  })
  freelancerId: string;

  @AutoMap(() => FreelancerEntity)
  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.gigs, {
    eager: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  /**== Tags ==*/
  @AutoMap(() => [GigTagEntity])
  @ManyToMany(() => GigTagEntity, {
    eager: true,
    cascade: true,
  })
  @JoinTable({
    name: 'gig_has_tags',
    joinColumn: { name: 'gig_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: GigTagEntity[];

  /**== FavoriteGigs ==*/
  // @AutoMap(() => [UserEntity])
  // @ManyToMany(() => UserEntity, (user) => user.favoriteGigLinks)
  // favoritedByUsers: UserEntity[];

  @OneToMany(() => UserFavoriteGigEntity, (ufg) => ufg.gig)
  favoritedByLinks: UserFavoriteGigEntity[];

  /* Overview */

  /* Pricing */
  @AutoMap()
  basicPrice: number;

  @AutoMap()
  standardPrice: number;

  @AutoMap()
  premiumPrice: number;

  @AutoMap(() => [GigPackagesEntity])
  @OneToMany(() => GigPackagesEntity, (pkg) => pkg.gig, {
    cascade: true,
    eager: true,
  })
  packages: GigPackagesEntity[];

  @AutoMap(() => PricingPackage)
  @Column({ type: 'json', nullable: true })
  pricingPackage: PricingPackage[];

  /* Pricing */

  /* Description & FAQ */
  @AutoMap()
  @Column({ type: 'mediumtext', nullable: true })
  description: string;

  @AutoMap(() => FAQ)
  @Column({ type: 'json', nullable: true })
  faqs: FAQ[];
  /* Description & FAQ */

  /* Gallery */
  @AutoMap(() => GigFileInfo)
  thumbnail: GigFileInfo | null;

  @AutoMap(() => GigImages)
  @Column({ type: 'json', nullable: true })
  images: GigImages | null;

  @AutoMap(() => GigDocuments)
  @Column({ type: 'json', nullable: true })
  documents: GigDocuments | null;

  @AutoMap(() => GigFileInfo)
  @Column({ type: 'json', nullable: true })
  video: GigFileInfo;

  /* Gallery */
  @AutoMap()
  @Column({ type: 'enum', enum: GigStatus, default: GigStatus.DRAFT })
  status: GigStatus;

  /* REVIEWS */
  @OneToMany(() => GigReviewEntity, (review) => review.gig)
  reviews: GigReviewEntity[];

  @AutoMap()
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
    nullable: false,
  })
  ratingAverage: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  favoriteCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  completeOrderCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  orderCount: number;

  @AutoMap()
  userId: string;

  @AutoMap()
  @OneToMany(() => OrderEntity, (order) => order.gig)
  orders: OrderEntity[];

  @AutoMap()
  @Column({ type: 'varchar', unique: true, length: 255, nullable: false })
  slug: string;

  @BeforeInsert()
  beforeInsert() {
    const noAccents = `${removeAccents(this.title)}-${Date.now()}`;
    this.slug = `${slugify(noAccents, { lower: true, strict: true })}`;

    this.updateAllCategory();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updateAllCategory();
  }

  @AfterLoad()
  afterLoad() {
    if (this.category) this.categoryId = this.category?.id ?? null;
    if (this.subCategory) this.subCategoryId = this.subCategory?.id ?? null;
    if (this.nestedSubcategory)
      this.nestedSubcategoryId = this.nestedSubcategory?.id ?? null;
    if (this.packages) {
      this.basicPrice =
        this.packages.find((pkg) => pkg.type === GigPackageType.BASIC)?.price ??
        0;

      this.standardPrice =
        this.packages.find((pkg) => pkg.type === GigPackageType.STANDARD)
          ?.price ?? 0;

      this.premiumPrice =
        this.packages.find((pkg) => pkg.type === GigPackageType.PREMIUM)
          ?.price ?? 0;
    }

    this.thumbnail =
      this.images?.image1 || this.images?.image2 || this.images?.image3 || null;
  }

  updateAllCategory() {
    if (!this.images?.image1 && !this.images?.image2 && !this.images?.image3) {
      this.images = null;
    }

    if (!this.documents?.document1 && !this.documents?.document2) {
      this.documents = null;
    }
  }
}
