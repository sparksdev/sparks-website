/*
  Warnings:

  - The values [contract] on the enum `Service` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Service_new" AS ENUM ('email', 'github', 'medium', 'phone', 'twitter', 'domain', 'smartContract');
ALTER TABLE "Attestation" ALTER COLUMN "service" TYPE "Service_new" USING ("service"::text::"Service_new");
ALTER TABLE "MemberStats" ALTER COLUMN "service" TYPE "Service_new" USING ("service"::text::"Service_new");
ALTER TYPE "Service" RENAME TO "Service_old";
ALTER TYPE "Service_new" RENAME TO "Service";
DROP TYPE "Service_old";
COMMIT;
