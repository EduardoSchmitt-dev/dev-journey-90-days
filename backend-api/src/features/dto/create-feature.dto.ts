import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FeatureSettingsDto } from './feature-settings.dto';


export class CreateFeatureDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @ValidateNested()
  @Type(() => FeatureSettingsDto)
  settings!: FeatureSettingsDto;
}
