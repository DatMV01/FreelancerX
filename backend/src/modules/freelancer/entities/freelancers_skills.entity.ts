import { AutoMap } from '@automapper/classes';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn
} from 'typeorm';
import { FreelancerEntity } from './freelancer.entity';

@Entity('skill')
export class SkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 50 })
  name: string;

  //   @ManyToMany(() => FreelancerEntity, (freelancer) => freelancer.skills)
  //   //Nếu xóa một ngôn ngữ, freelancer vẫn không bị ảnh hưởng (vì không có onDelete: 'CASCADE' bên FreelancerLanguageEntity).
  //   freelancers: FreelancerEntity[];

  @AutoMap(() => [FreelancersSkills])
  @OneToMany(() => FreelancersSkills, (freelancer) => freelancer.skills, {
    onDelete: 'CASCADE', // Khi freelancer bị xóa, giá trị trong bảng trung gian sẽ xóa
  })
  freelancers?: FreelancersSkills[];
}

@Entity('freelancers_skills')
@Index(['freelancerId', 'skillId'], { unique: true })
export class FreelancersSkills {
  @Index()
  @PrimaryColumn({ type: 'char', length: 36, name: 'freelancer_id' })
  freelancerId: string;

  @Index()
  @PrimaryColumn({ type: 'char', length: 36, name: 'skill_id' })
  skillId: string;

  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.skills, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancers: FreelancerEntity;

  @ManyToOne(() => SkillEntity, (skill) => skill.freelancers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'skill_id' })
  skills: SkillEntity;
}
