/*
  Warnings:

  - A unique constraint covering the columns `[userId,hash]` on the table `MemberStats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MemberStats_userId_hash_key" ON "MemberStats"("userId", "hash");
