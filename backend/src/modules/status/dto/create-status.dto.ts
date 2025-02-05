import { Allow, IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @Allow()
  @IsNotEmpty()
  name: string;

  @Allow()
  description?: string;
}
