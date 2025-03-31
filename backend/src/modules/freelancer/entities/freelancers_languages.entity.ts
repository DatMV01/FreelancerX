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
import { ApiProperty } from '@nestjs/swagger';

@Entity('language')
export class LanguageEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 3 })
  @ApiProperty()
  alpha3: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  @ApiProperty()
  name: string;

  // @ManyToMany(() => FreelancerEntity, (freelancer) => freelancer.languages)
  // //Nếu xóa một ngôn ngữ, freelancer vẫn không bị ảnh hưởng (vì không có onDelete: 'CASCADE' bên FreelancerLanguageEntity).
  // freelancers: FreelancerEntity[];

  @AutoMap(() => [FreelancersLanguages])
  @OneToMany(() => FreelancersLanguages, (_) => _.language)
  freelancers?: FreelancersLanguages[];
}

@Entity('freelancers_languages')
@Index(['freelancerId', 'languageId'], { unique: true })
export class FreelancersLanguages {
  @Index()
  @PrimaryColumn({ type: 'char', length: 36, name: 'freelancer_id' })
  freelancerId: string;

  @Index()
  @PrimaryColumn({ type: 'number', name: 'language_id' })
  languageId: number;

  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.languages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  @ManyToOne(() => LanguageEntity, (language) => language.freelancers, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'language_id' })
  language: LanguageEntity;

  @Column({
    type: 'enum',
    enum: FreelancerProficiencyLevel,
    default: FreelancerProficiencyLevel.BEGINNER,
  })
  proficiency_level: FreelancerProficiencyLevel;
}
