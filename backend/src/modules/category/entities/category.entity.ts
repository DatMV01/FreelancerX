import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
  ManyToMany,
} from 'typeorm';

@Entity('category')
export class CategoryEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**== Category ==*/
  @AutoMap()
  @Index()
  @Column({
    name: 'parent_id',
    nullable: true,
    type: 'char',
    length: 36,
  })
  parentId: string;

  @AutoMap(() => CategoryEntity)
  @ManyToOne(() => CategoryEntity, (category) => category.subCategories)
  @JoinColumn({ name: 'parent_id' })
  parentCategory: CategoryEntity;

  /**== SubCategory ==*/
  @AutoMap(() => [CategoryEntity])
  @OneToMany(() => CategoryEntity, (category) => category.parentCategory, {
    onDelete: 'SET NULL',
    cascade: true,
  })
  subCategories: CategoryEntity[];

  /* =======*/
  @AutoMap()
  @Column()
  title: string;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  slogan: string;

  @AutoMap()
  @Column({ unique: true, nullable: false })
  slug: string;

  @AutoMap()
  @Column({ unique: true, nullable: false })
  url: string;

  @AutoMap(() => [GigEntity])
  @OneToMany(() => GigEntity, (gig) => gig.category)
  gigs: GigEntity[];

  // @ManyToMany(() => FreelancerEntity, (freelancer) => freelancer.categories)
  // freelancers: FreelancerEntity[];
}
