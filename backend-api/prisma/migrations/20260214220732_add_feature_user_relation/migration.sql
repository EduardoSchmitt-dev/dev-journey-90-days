/*
  Warnings:

  - Added the required column `userId` to the `Feature` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Feature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "Feature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Feature" ("createdAt", "deletedAt", "description", "id", "name") SELECT "createdAt", "deletedAt", "description", "id", "name" FROM "Feature";
DROP TABLE "Feature";
ALTER TABLE "new_Feature" RENAME TO "Feature";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
