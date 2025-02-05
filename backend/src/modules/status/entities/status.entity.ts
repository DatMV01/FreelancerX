import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'status',
})
export class StatusEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ nullable: true })
  description?: string;
}
