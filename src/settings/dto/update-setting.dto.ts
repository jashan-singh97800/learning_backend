import { IsNumber, Min, Max } from 'class-validator';

export class UpdateSettingDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  gstPercentage: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;
}
