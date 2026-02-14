import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService { 
  constructor (
    private readonly prisma: PrismaService,
    readonly jwtService: JwtService, 
    )  {}

  

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  
  async login(data: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const isPasswordValid = await this.comparePassword(
    data.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const payload = { sub: user.id, email: user.email };

  const access_token = this.jwtService.sign(payload, {
    expiresIn: '15m',
  });

  const refresh_token = this.jwtService.sign(payload, {
    expiresIn: '7d',
  });

  // 🔐 Hashear refresh token antes de salvar
  const hashedRefreshToken = await this.hashPassword(refresh_token);

  await this.prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefreshToken },
  });

  return {
    access_token,
    refresh_token,
  };
}


  async register(data: RegisterDto) {
  const hashedPassword = await this.hashPassword(data.password);

  const freePlan = await this.prisma.plan.findUnique({
    where: { name: 'Free' },
  });

  if (!freePlan) {
    throw new Error('Free plan not found');
  }

  const user = await this.prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      planId: freePlan.id,
    },
  });

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

  async refreshToken(userId: number, refreshToken: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.refreshToken) {
    throw new UnauthorizedException('Access denied');
  }

  const isRefreshTokenValid = await this.comparePassword(
    refreshToken,
    user.refreshToken,
  );

  if (!isRefreshTokenValid) {
    throw new UnauthorizedException('Access denied');
  }

  const payload = { sub: user.id, email: user.email };

  const newAccessToken = this.jwtService.sign(payload, {
    expiresIn: '15m',
  });

  return {
    access_token: newAccessToken,
  };
 }
  async logout(userId: number) {
  await this.prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return { message: 'Logged out successfully' };
 }

}
