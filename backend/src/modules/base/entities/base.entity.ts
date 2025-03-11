import { AutoMap } from '@automapper/classes';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @AutoMap(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @AutoMap(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @AutoMap(() => Date)
  @DeleteDateColumn()
  deletedAt: Date;
}
