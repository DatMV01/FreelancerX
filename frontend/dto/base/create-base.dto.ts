import { BaseDto } from "./base.dto";

export class CreateBaseDto<T> extends BaseDto<
  Omit<BaseDto<T>, "createdAt" | "updatedAt" | "deletedAt">
> {
  constructor(
    partial: Partial<Omit<T, "createdAt" | "updatedAt" | "deletedAt">>,
  ) {
    super(partial);
  }
}
