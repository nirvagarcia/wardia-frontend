/*
  Warnings:

  - You are about to drop the column `digitalKeyEnc` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `securityTokenEnc` on the `Credential` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "digitalKeyEnc",
DROP COLUMN "notes",
DROP COLUMN "securityTokenEnc",
ADD COLUMN     "accountNumberEnc" TEXT,
ADD COLUMN     "accountType" TEXT,
ADD COLUMN     "cardName" TEXT,
ADD COLUMN     "cardNetwork" TEXT,
ADD COLUMN     "cardholderName" TEXT,
ADD COLUMN     "cciEnc" TEXT,
ADD COLUMN     "credentialName" TEXT,
ADD COLUMN     "creditLimitCurrency" TEXT,
ADD COLUMN     "creditLimitValue" DOUBLE PRECISION,
ADD COLUMN     "cutoffDay" INTEGER,
ADD COLUMN     "cvvEnc" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expiryMonth" INTEGER,
ADD COLUMN     "expiryYear" INTEGER,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'bank',
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "passwordEnc" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Credential_userId_type_idx" ON "Credential"("userId", "type");
