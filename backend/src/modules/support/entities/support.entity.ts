import { AutoMap } from '@automapper/classes';
import { OmitType } from '@nestjs/mapped-types';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('supports')
export class SupportEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  email: string;

  @AutoMap()
  @Column()
  subject: string;

  @AutoMap()
  @Column('text')
  message: string;

  @AutoMap()
  @Column('text', { nullable: true })
  messageReply: string;

  // @AutoMap(() => Date)
  // @Column({ type: 'timestamp', nullable: true })
  // replyAt: Date;
}
