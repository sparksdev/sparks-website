/*
  Warnings:

  - Added the required column `publicKey` to the `DeployerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeployerProfile" ADD COLUMN     "publicKey" TEXT NOT NULL;
