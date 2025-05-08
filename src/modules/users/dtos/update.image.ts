import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateImageDto {

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  @IsOptional()
  image?: Express.Multer.File;
}
