import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty({ example: 'Export PDF' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Allows user to export reports as PDF' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description?: string;
}
