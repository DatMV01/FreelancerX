import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
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
  Requirement,
} from '../dto/gig.dto';
import { GigStatus } from '../enum/gig.status';
import { slugify } from 'src/utils/slugify';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'tag' })
export class GigTagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  name: string;
}

@Entity({ name: 'gig' })
@Index('IDX_gig_search', ['title', 'description', 'slug'], { fulltext: true })
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
  category?: CategoryEntity;

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
  subCategory?: CategoryEntity;

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
  nestedSubcategory?: CategoryEntity;

  @AutoMap(() => [GigTagEntity])
  @ManyToMany(() => GigTagEntity, {
    eager: true,
    cascade: true,
  })
  @JoinTable({
    name: 'gigs_tags',
    joinColumn: { name: 'gig_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags?: GigTagEntity[];

  @ManyToMany(() => UserEntity, (user) => user.favoriteGigs)
  users: UserEntity[];
  /* Overview */

  /* Overview */

  /* Pricing */
  @AutoMap()
  @Index()
  @Column({ type: 'bigint' })
  // @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  basicPrice: number;

  @AutoMap()
  @Index()
  @Column({ type: 'bigint' })
  // @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standardPrice: number;

  @AutoMap()
  @Index()
  @Column({ type: 'bigint' })
  // @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  premiumPrice: number;

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

  /* RATING */
  @AutoMap(() => RatingEntity)
  @OneToMany(() => RatingEntity, (rating) => rating.gig, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ratings: RatingEntity[];

  @AutoMap()
  @Column({
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0,
    nullable: false,
  })
  ratingAverate: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  // @Column({ type: 'int', default: 0 })
  // popularity: number = 0;

  // @Column({ type: 'boolean', default: false })
  // isPromoted: boolean = false;

  @AutoMap()
  userId: string;

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
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer?: FreelancerEntity;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  orderCount: number;

  @AutoMap()
  @OneToMany(() => OrderEntity, (order) => order.gig)
  orders: OrderEntity[];

  @AutoMap()
  @Column({ type: 'varchar', length: 255, nullable: false })
  slug: string;

  @BeforeInsert()
  beforeInsert() {
    this.slug = `${slugify(this.title)}-${Date.now()}`;

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
  }

  updateAllCategory() {
    // this.category = (this.category as any) === '' ? null : this.category;

    // this.subCategory =
    //   (this.subCategory as any) === '' ? null : this.subCategory;

    // this.nestedSubcategory =
    //   (this.nestedSubcategory as any) === '' ? null : this.nestedSubcategory;

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
