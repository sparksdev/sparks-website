/*
  Warnings:

  - A unique constraint covering the columns `[signature]` on the table `DeployerProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `signature` to the `DeployerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeployerProfile" ADD COLUMN     "signature" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DeployerProfile_signature_key" ON "DeployerProfile"("signature");
