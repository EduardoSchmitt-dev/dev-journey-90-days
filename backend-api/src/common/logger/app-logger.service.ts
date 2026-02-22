import { Injectable, LoggerService } from "@nestjs/common";
import { time } from "console";
import { timestamp } from "rxjs";

@Injectable()
export class AppLogger implements LoggerService { 
  log(message: string, context?: string, meta?: unknown) {
  console.log(
    JSON.stringify({
      level: 'info',
      message,
      context,
      meta,
      timestamp: new Date().toISOString(),
    }),
  );
}

warn(message: string, context?: string, meta?: unknown) {
  console.warn(
    JSON.stringify({
      level: 'warn',
      message,
      context,
      meta,
      timestamp: new Date().toISOString(),
    }),
  );
}

error(message: string, trace?: string, context?: string, meta?: unknown) {
  console.error(
    JSON.stringify({
      level: 'error',
      message,
      trace,
      context,
      meta,
      timestamp: new Date().toISOString(),
    }),
  );
}

  debug(message: string, context?: string) {
    console.debug(
      JSON.stringify({
        level: 'debug',
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  verbose(message: string, context?: string) {
    console.log(
      JSON.stringify({
        level: 'verbose',
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}