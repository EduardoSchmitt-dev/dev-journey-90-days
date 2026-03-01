-- CreateIndex
CREATE INDEX "Feature_userId_idx" ON "Feature"("userId");

-- CreateIndex
CREATE INDEX "Feature_createdAt_idx" ON "Feature"("createdAt");

-- CreateIndex
CREATE INDEX "Feature_deletedAt_idx" ON "Feature"("deletedAt");

-- CreateIndex
CREATE INDEX "Feature_name_idx" ON "Feature"("name");

-- CreateIndex
CREATE INDEX "Feature_userId_createdAt_idx" ON "Feature"("userId", "createdAt");
