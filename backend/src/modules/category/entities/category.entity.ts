import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CategoryEntity, (category) => category.subCategories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: CategoryEntity;

  /* =======*/

  @ManyToOne(() => CategoryEntity, (category) => category.subCategories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_category_slug', referencedColumnName: 'slug' })
  parentCategorySlug: CategoryEntity;
  /* =======*/

  @Column()
  title: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  slogen: string;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  url: string;

  @OneToMany(() => CategoryEntity, (category) => category.parentCategory)
  subCategories: CategoryEntity[];

  @OneToMany(() => GigEntity, (gig) => gig.category)
  gigs: GigEntity[];
}
