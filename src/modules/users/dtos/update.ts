import { ApiProperty } from '@nestjs/swagger';
import { IUpdateUserRequest } from '../interfaces';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDto implements IUpdateUserRequest {
  @ApiProperty({
    type: 'string',
    required: false,
    example: 'foo',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string | undefined;

  @ApiProperty({
    type: 'number',
    required: false,
    example: '18',
  })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(18)
  age?: number | undefined;

  @ApiProperty({
    type: 'string',
    required: false,
    example: 'foo123',
  })
  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string | undefined;
}
