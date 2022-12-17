/*
  Warnings:

  - A unique constraint covering the columns `[contract]` on the table `DeployerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DeployerProfile_userId_contract_key";

-- CreateIndex
CREATE UNIQUE INDEX "DeployerProfile_contract_key" ON "DeployerProfile"("contract");
