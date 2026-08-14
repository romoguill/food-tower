import { IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMenuItemDto {
  @IsUUID()
  categoryId!: string;

  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumberString()
  price!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
