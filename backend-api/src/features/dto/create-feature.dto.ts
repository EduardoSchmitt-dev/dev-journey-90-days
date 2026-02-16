import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FeatureSettingsDto } from './feature-settings.dto';
import { ApiProperty } from '@nestjs/swagger';


export class CreateFeatureDto {
  @ApiProperty({
    example: 'Feature A',
    description: 'Feature name',
  })
  name!: string;

  @ApiProperty({
    example: 'Description of the feature',
    required: false,
  })
  description?: string;
}

