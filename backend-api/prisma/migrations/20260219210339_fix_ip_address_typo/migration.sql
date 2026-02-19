/*
  Warnings:

  - You are about to drop the column `ipAddres` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RefreshToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "parentJti" TEXT,
    "replacedByJti" TEXT,
    "revokedAt" DATETIME,
    "expiresAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RefreshToken" ("createdAt", "deviceHash", "expiresAt", "familyId", "hashedToken", "id", "jti", "parentJti", "replacedByJti", "revokedAt", "userAgent", "userId") SELECT "createdAt", "deviceHash", "expiresAt", "familyId", "hashedToken", "id", "jti", "parentJti", "replacedByJti", "revokedAt", "userAgent", "userId" FROM "RefreshToken";
DROP TABLE "RefreshToken";
ALTER TABLE "new_RefreshToken" RENAME TO "RefreshToken";
CREATE UNIQUE INDEX "RefreshToken_jti_key" ON "RefreshToken"("jti");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
