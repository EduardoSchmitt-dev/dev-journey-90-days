import { Injectable } from '@nestjs/common';

interface LockData {
  attempts: number;
  lockedUntil: number | null;
}

@Injectable()
export class ProgressiveLockService {
  private locks = new Map<string, LockData>();

  private lockDurations = [60_000, 5 * 60_000, 15 * 60_000, 60 * 60_000];

  registerFailure(key: string) {
    const now = Date.now();
    const data = this.locks.get(key) || { attempts: 0, lockedUntil: null };

    data.attempts += 1;

    const duration =
      this.lockDurations[Math.min(data.attempts - 1, this.lockDurations.length - 1)];

    data.lockedUntil = now + duration;

    this.locks.set(key, data);

    return duration;
  }

  isLocked(key: string): boolean {
    const data = this.locks.get(key);
    if (!data?.lockedUntil) return false;

    if (Date.now() > data.lockedUntil) {
      this.locks.delete(key);
      return false;
    }

    return true;
  }

  clear(key: string) {
    this.locks.delete(key);
  }
}