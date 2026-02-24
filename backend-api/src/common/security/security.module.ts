import { Module } from "@nestjs/common";
import { ProgressiveLockService } from "./progressive-lock.service";

@Module({ 
    providers: [ProgressiveLockService],
    exports: [ProgressiveLockService],
})
export class SecurityModule {}