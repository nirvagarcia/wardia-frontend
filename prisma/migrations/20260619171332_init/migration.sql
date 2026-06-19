-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "iconUrl" TEXT,
    "amountValue" DOUBLE PRECISION NOT NULL,
    "amountCurrency" TEXT NOT NULL DEFAULT 'PEN',
    "frequency" TEXT NOT NULL,
    "nextPaymentDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "autoRenewal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Service_userId_idx" ON "Service"("userId");

-- CreateIndex
CREATE INDEX "Service_userId_status_idx" ON "Service"("userId", "status");
