/*
  Warnings:

  - You are about to drop the `DeployerProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeployerProfile" DROP CONSTRAINT "DeployerProfile_userId_fkey";

-- DropTable
DROP TABLE "DeployerProfile";
