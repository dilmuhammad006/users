import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ICreateUserRequest } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateDto implements ICreateUserRequest {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'foo',
  })
  @IsString()
  @MinLength(2)
  name: string;
  //
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'foo@gmail.com',
  })
  @MinLength(4)
  @IsEmail()
  email: string;
  //

  @ApiProperty({
    type: 'number',
    required: true,
    example: '18',
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(18)
  age: number;
  //

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'foo123',
  })
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsOptional()
  image: Express.Multer.File;
}
