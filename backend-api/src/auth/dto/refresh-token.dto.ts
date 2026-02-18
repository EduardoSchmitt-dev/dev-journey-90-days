import { IsString } from "class-validator";


export class refreshTokenDto {
  @IsString()
  refresh_token!: string;
}