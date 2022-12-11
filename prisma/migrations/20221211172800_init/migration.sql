-- CreateEnum
CREATE TYPE "Service" AS ENUM ('email', 'github', 'medium', 'phone', 'twitter');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Attestation" (
    "attestationId" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "humanId" TEXT NOT NULL,
    "service" "Service" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Attestation_pkey" PRIMARY KEY ("attestationId")
);

-- CreateTable
CREATE TABLE "MemberStats" (
    "memberStatsId" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "humanId" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "service" "Service" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MemberStats_pkey" PRIMARY KEY ("memberStatsId")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberStats_hash_key" ON "MemberStats"("hash");

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberStats" ADD CONSTRAINT "MemberStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
