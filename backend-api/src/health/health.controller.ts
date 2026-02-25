import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../infrastructure/prisma/prisma.service";

@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  //LIVENESS
  @Get('live')
  live() {
    return { 
      status: 'alive',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  // READINESS
  @Get('ready')
async ready() {
  try {
    await this.prisma.$queryRaw`SELECT 1`;
    
    return {
      success: true,
      status: 'ready',
      database: 'connected',
    };
  } catch (error) {
    return {
      success: false,
      status: 'not_ready',
      database: 'disconnected',
    };
  }
 }  
}
