import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeaturesModule } from './features/features.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlanGuard } from './common/guards/plan.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FeaturesModule,
    AuthModule,
    UsersModule,
  ],
  providers: [PlanGuard],
})
export class AppModule {}

