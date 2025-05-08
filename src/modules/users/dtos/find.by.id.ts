import { Transform } from 'class-transformer';
import { IFindByIdRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class FindByIdDto implements IFindByIdRequest {
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: 'number',
    required: true,
    example: 1,
  })
  @IsInt()
  id: number;
}
