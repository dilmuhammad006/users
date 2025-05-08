import { Transform } from 'class-transformer';
import { IDeleteUserRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeleteDto implements IDeleteUserRequest {
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({
    type: 'number',
    required: true,
    example: 1,
  })
  @IsInt()
  id: number;
}
