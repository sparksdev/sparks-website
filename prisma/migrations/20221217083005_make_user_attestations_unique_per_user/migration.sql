/*
  Warnings:

  - A unique constraint covering the columns `[userId,hash]` on the table `Attestation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `hash` on table `Attestation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attestation" ALTER COLUMN "hash" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Attestation_userId_hash_key" ON "Attestation"("userId", "hash");
