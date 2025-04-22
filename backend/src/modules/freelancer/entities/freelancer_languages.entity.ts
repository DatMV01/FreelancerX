import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import {
  FreelancerLanguageProficiency
} from '../enum/freelancer.enum';
import { FreelancerEntity } from './freelancer.entity';

@Entity('languages')
export class LanguageEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  @ApiProperty()
  id: number;

  @AutoMap()
  @Column({ unique: true, type: 'varchar', length: 3 })
  @ApiProperty()
  alpha3: string;

  @AutoMap()
  @Column({ unique: true, type: 'varchar', length: 50 })
  @ApiProperty()
  name: string;

  @AutoMap()
  proficiency: FreelancerLanguageProficiency;
  // @ManyToMany(() => FreelancerEntity, (freelancer) => freelancer.languages)
  // //Nếu xóa một ngôn ngữ, freelancer vẫn không bị ảnh hưởng (vì không có onDelete: 'CASCADE' bên FreelancerLanguageEntity).
  // freelancers: FreelancerEntity[];

  @AutoMap(() => [FreelancersLanguages])
  @OneToMany(() => FreelancersLanguages, (_) => _.language)
  freelancers?: FreelancersLanguages[];
}

@Entity('freelancer_languages')
export class FreelancersLanguages {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @Column({ type: 'char', length: 36, name: 'freelancer_id' })
  freelancerId: string;

  @Index()
  @Column({ type: 'number', name: 'language_id' })
  languageId: number;

  @ManyToOne(
    () => FreelancerEntity,
    (freelancer) => freelancer.freelancersLanguages,
    {
      onDelete: 'CASCADE',
    },
  )
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
    enum: FreelancerLanguageProficiency,
    default: FreelancerLanguageProficiency.BEGINNER,
  })
  proficiency: FreelancerLanguageProficiency;
}
