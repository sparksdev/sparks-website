-- AlterEnum
ALTER TYPE "Service" ADD VALUE 'contract';

-- CreateTable
CREATE TABLE "DeployerProfile" (
    "deployerProfileId" TEXT NOT NULL,
    "contract" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "profile" JSONB NOT NULL,
    "publicKey" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DeployerProfile_pkey" PRIMARY KEY ("deployerProfileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeployerProfile_contract_key" ON "DeployerProfile"("contract");

-- AddForeignKey
ALTER TABLE "DeployerProfile" ADD CONSTRAINT "DeployerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
