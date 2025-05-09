import { ApiProperty } from '@nestjs/swagger';
import { IGetALlUsersRequest, sortField, sortOrder } from '../interfaces';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class GetAllDto implements IGetALlUsersRequest {
  @ApiProperty({
    type: 'number',
    format: 'string',
    example: '1',
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  page: number;

  @ApiProperty({
    type: 'number',
    format: 'string',
    example: '1',
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  limit: number;

  @ApiProperty({
    type: 'string',
    enum: sortOrder,
    example: sortOrder.ASC,
    required: false,
  })
  @IsString()
  @IsOptional()
  sortOrder: sortOrder;

  @ApiProperty({
    type: 'string',
    enum: sortField,
    example: sortField.id,
    required: false,
  })
  @IsString()
  @IsOptional()
  sorrtField: sortField;
}
