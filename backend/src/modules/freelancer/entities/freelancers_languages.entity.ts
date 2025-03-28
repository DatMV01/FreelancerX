import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FreelancerProficiencyLevel } from '../enum/freelancer.enum';
import { FreelancerEntity } from './freelancer.entity';
import { AutoMap } from '@automapper/classes';

@Entity('language')
export class LanguageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  name: string;

  // @ManyToMany(() => FreelancerEntity, (freelancer) => freelancer.languages)
  // //Nếu xóa một ngôn ngữ, freelancer vẫn không bị ảnh hưởng (vì không có onDelete: 'CASCADE' bên FreelancerLanguageEntity).
  // freelancers: FreelancerEntity[];

  @AutoMap(() => [FreelancersLanguages])
  @OneToMany(() => FreelancersLanguages, (_) => _.languages, {
    onDelete: 'CASCADE', // Khi freelancer bị xóa, giá trị trong bảng trung gian sẽ xóa
  })
  freelancers?: FreelancersLanguages[];
}

@Entity('freelancers_languages')
@Index(['freelancerId', 'languageId'], { unique: true })
export class FreelancersLanguages {
  @Index()
  @PrimaryColumn({ type: 'char', length: 36, name: 'freelancer_id' })
  freelancerId: string;

  @Index()
  @PrimaryColumn({ type: 'char', length: 36, name: 'language_id' })
  languageId: string;

  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.languages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancers: FreelancerEntity;

  @ManyToOne(
    () => LanguageEntity,
    (language) => language.freelancers,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'language_id' })
  languages: LanguageEntity;

  @Column({
    type: 'enum',
    enum: FreelancerProficiencyLevel,
    default: FreelancerProficiencyLevel.BEGINNER,
  })
  proficiency_level: FreelancerProficiencyLevel;
}
