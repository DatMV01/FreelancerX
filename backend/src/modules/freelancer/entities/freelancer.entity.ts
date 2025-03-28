import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  FreelancerProficiencyLevel,
  FreelancerRankEnum,
} from '../enum/freelancer.enum';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import { FreelancersLanguages } from './freelancers_languages.entity';
import { FreelancersSkills } from './freelancers_skills.entity';

@Entity('freelancer')
export class FreelancerEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  @Column({
    name: 'user_id',
    type: 'char',
    length: 36,
  })
  userId: string;

  @AutoMap(() => UserEntity)
  @OneToOne(() => UserEntity, (user) => user.freelancer, {
    nullable: false,
    eager: false,
    onDelete: 'CASCADE', //  Nếu user bị xóa, freelancer cũng bị xóa theo.
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: FreelancerRankEnum,
    default: FreelancerRankEnum.NEW,
  })
  level: FreelancerRankEnum;

  @AutoMap()
  @Column({ type: 'text', nullable: true })
  bio?: string;

  // @AutoMap(() => [String])
  // @Column({ type: 'simple-array', nullable: true })
  // languages?: string[];

  // @AutoMap(() => [FreelancerLanguageEntity])
  // @ManyToMany(
  //   () => FreelancerLanguageEntity,
  //   (language) => language.freelancers,
  //   {
  //     onDelete: 'CASCADE', // Khi freelancer bị xóa, giá trị trong bảng trung gian sẽ xóa
  //   },
  // )
  // @JoinTable({
  //   name: 'freelancers_languages',
  //   joinColumn: { name: 'freelancer_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'language_id', referencedColumnName: 'id' },
  // })
  // languages?: FreelancerLanguageEntity[];

  @AutoMap(() => [FreelancersLanguages])
  @OneToMany(() => FreelancersLanguages, (language) => language.freelancers, {
    onDelete: 'CASCADE', // Khi freelancer bị xóa, giá trị trong bảng trung gian sẽ xóa
    eager: true,
  })
  languages?: FreelancersLanguages[];

  // @AutoMap(() => [String])
  // @Column({ type: 'simple-array', nullable: true })
  // skills?: string[];

  @AutoMap(() => [FreelancersSkills])
  @ManyToMany(() => FreelancersSkills, (skill) => skill.freelancers, {
    onDelete: 'CASCADE', // Khi freelancer bị xóa, giá trị trong bảng trung gian sẽ xóa
    eager: true,
  })
  skills?: FreelancersSkills[];

  @AutoMap(() => [CategoryEntity])
  @ManyToMany(() => CategoryEntity, (category) => category.freelancers, {
    onDelete: 'CASCADE', // Khi freelancer bị xóa, giá trị trong bảng trung gian sẽ xóa
  })
  @JoinTable({
    name: 'freelancers_categories',
    joinColumn: { name: 'freelancer_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories?: CategoryEntity[];

  @AutoMap(() => [RatingEntity])
  @OneToMany(() => RatingEntity, (rating) => rating.freelancer, {
    eager: false,
    onDelete: 'SET NULL',
  })
  ratings: RatingEntity[];

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  @Index('IDX_freelancer_completed_orders')
  completedOrderCount: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  @Index('IDX_freelancer_response_time')
  responseTime?: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  @Index('IDX_freelancer_rating')
  completedRate?: number;

  @AutoMap()
  @Column({ type: 'bigint', default: 0 })
  earnings: number;

  @AutoMap()
  @Column({ type: 'bigint', default: 0 })
  withdrawnAmount: number;

  @AutoMap(() => [GigEntity])
  @OneToMany(() => GigEntity, (gig) => gig.freelancer, {
    eager: false,
    onDelete: 'NO ACTION',
  })
  gigs: GigEntity[];

  @AutoMap(() => [OrderEntity])
  @OneToMany(() => OrderEntity, (order) => order.freelancer, {
    eager: false,
    onDelete: 'NO ACTION',
  })
  orders: OrderEntity[];
}
