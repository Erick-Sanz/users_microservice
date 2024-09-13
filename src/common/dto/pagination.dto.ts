import { IsNumber, IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Min(0)
  skip: number;
  @IsNumber()
  @Min(0)
  limit: number;
}
