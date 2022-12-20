/*
  Warnings:

  - A unique constraint covering the columns `[signature]` on the table `DeployerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "DeployerProfile" ADD COLUMN     "signature" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DeployerProfile_signature_key" ON "DeployerProfile"("signature");
