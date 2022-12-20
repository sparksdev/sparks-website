/*
  Warnings:

  - Made the column `signature` on table `DeployerProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DeployerProfile" ALTER COLUMN "signature" SET NOT NULL;
