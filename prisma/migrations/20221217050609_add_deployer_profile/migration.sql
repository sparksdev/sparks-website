-- CreateTable
CREATE TABLE "DeployerProfile" (
    "deployerProfileId" TEXT NOT NULL,
    "contract" TEXT NOT NULL,
    "profile" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DeployerProfile_pkey" PRIMARY KEY ("deployerProfileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeployerProfile_userId_contract_key" ON "DeployerProfile"("userId", "contract");

-- AddForeignKey
ALTER TABLE "DeployerProfile" ADD CONSTRAINT "DeployerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
