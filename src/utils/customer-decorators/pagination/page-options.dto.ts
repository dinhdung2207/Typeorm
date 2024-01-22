import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

export enum EOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
    type: Number,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  take?: number = 10;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    type: Number,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({
    default: EOrder.ASC,
    enum: EOrder,
  })
  @IsEnum(EOrder)
  order?: EOrder = EOrder.ASC;

  skip(): number {
    return (this.page - 1) * this.take;
  }
}
