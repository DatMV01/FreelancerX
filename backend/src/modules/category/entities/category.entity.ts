import { AutoMap } from '@automapper/classes';
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
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => CategoryEntity)
  @ManyToOne(() => CategoryEntity, (category) => category.subCategories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: CategoryEntity;

  /* =======*/
  @AutoMap(() => CategoryEntity)
  @ManyToOne(() => CategoryEntity, (category) => category.subCategories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_category_slug', referencedColumnName: 'slug' })
  parentCategorySlug: CategoryEntity;
  /* =======*/
  @AutoMap()
  @Column()
  title: string;

  @AutoMap()
  @Column({ nullable: true })
  icon: string;

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  description: string;

  @AutoMap()
  @Column({ nullable: true })
  slogen: string;

  @AutoMap()
  @Column({ unique: true })
  slug: string;

  @AutoMap()
  @Column({ unique: true })
  url: string;

  @AutoMap(() => [CategoryEntity])
  @OneToMany(() => CategoryEntity, (category) => category.parentCategory)
  subCategories: CategoryEntity[];

  @AutoMap(() => [GigEntity])
  @OneToMany(() => GigEntity, (gig) => gig.category)
  gigs: GigEntity[];
}
