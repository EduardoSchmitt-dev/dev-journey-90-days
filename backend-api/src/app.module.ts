import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';


@Module({
imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  FeaturesModule,
  AuthModule, // 👈 ADICIONE AQUI
],

})
export class AppModule {}
