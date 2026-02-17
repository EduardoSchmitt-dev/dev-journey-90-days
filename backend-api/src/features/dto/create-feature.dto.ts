import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FeatureSettingsDto } from './feature-settings.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

  

