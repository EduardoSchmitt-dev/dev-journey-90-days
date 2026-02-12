import { IsBoolean } from 'class-validator';

export class FeatureSettingsDto {
  @IsBoolean()
  enabled!: boolean;
}
