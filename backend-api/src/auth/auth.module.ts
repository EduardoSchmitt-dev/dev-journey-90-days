import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from './services/auth.service';
import { AuthController } from "./controllers/auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { AuthRepository } from "./repositories/auth.repository";


@Module({
  imports: [
    JwtModule.register({
  secret: process.env.JWT_SECRET || 'dev-secret',
  signOptions: { expiresIn: '15m' }, // access token curto
}),

  ],
  controllers: [AuthController],
  providers: [AuthService,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
