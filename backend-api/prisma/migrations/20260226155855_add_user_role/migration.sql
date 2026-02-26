-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PRO', 'FREE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'FREE';
