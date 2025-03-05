export class BaseDto<T> {
  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

  id!: string;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
