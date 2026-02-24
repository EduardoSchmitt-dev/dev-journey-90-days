import { Injectable, HttpException, HttpStatus, } from '@nestjs/common';

interface AttemptData {
  attempts: number;
  lastAttempt: number;
  lockUntil?: number;
}

@Injectable()
export class ProgressiveLockService {
  private readonly store = new Map<string, AttemptData>();

  private readonly maxAttempts = 5;
  private readonly baseDelay = 300; // ms

  async checkLock(identifier: string) {
    const data = this.store.get(identifier);
    if (!data) return;

    // Se estiver bloqueado
    if (data.lockUntil && Date.now() < data.lockUntil) {
      throw new HttpException('Account temporarily locked', HttpStatus.TOO_MANY_REQUESTS);
    }

    // Delay progressivo
    if (data.attempts > 0) {
      const delay = this.baseDelay * Math.pow(2, data.attempts - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  async registerFailure(identifier: string) {
    const now = Date.now();
    const data = this.store.get(identifier);

    if (!data) {
      this.store.set(identifier, {
        attempts: 1,
        lastAttempt: now,
      });
      return;
    }

    data.attempts += 1;
    data.lastAttempt = now;

    if (data.attempts >= this.maxAttempts) {
      data.lockUntil = now + 60_000; // 1 minuto bloqueado
    }

    this.store.set(identifier, data);
  }

  async reset(identifier: string) {
    this.store.delete(identifier);
  }
}