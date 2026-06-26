-- CreateTable
CREATE TABLE "PlanningBoard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningList" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningItem" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "priceValue" DOUBLE PRECISION,
    "priceCurrency" TEXT NOT NULL DEFAULT 'PEN',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "tags" TEXT[],
    "notes" TEXT,
    "purchasedAt" TIMESTAMP(3),
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanningItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningItemLink" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "label" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanningItemLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlanningBoard_shareToken_key" ON "PlanningBoard"("shareToken");

-- CreateIndex
CREATE INDEX "PlanningBoard_userId_idx" ON "PlanningBoard"("userId");

-- CreateIndex
CREATE INDEX "PlanningBoard_userId_archived_idx" ON "PlanningBoard"("userId", "archived");

-- CreateIndex
CREATE INDEX "PlanningBoard_shareToken_idx" ON "PlanningBoard"("shareToken");

-- CreateIndex
CREATE INDEX "PlanningList_boardId_idx" ON "PlanningList"("boardId");

-- CreateIndex
CREATE INDEX "PlanningList_boardId_archived_idx" ON "PlanningList"("boardId", "archived");

-- CreateIndex
CREATE INDEX "PlanningItem_listId_idx" ON "PlanningItem"("listId");

-- CreateIndex
CREATE INDEX "PlanningItem_listId_status_idx" ON "PlanningItem"("listId", "status");

-- CreateIndex
CREATE INDEX "PlanningItemLink_itemId_idx" ON "PlanningItemLink"("itemId");

-- AddForeignKey
ALTER TABLE "PlanningBoard" ADD CONSTRAINT "PlanningBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningList" ADD CONSTRAINT "PlanningList_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "PlanningBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningItem" ADD CONSTRAINT "PlanningItem_listId_fkey" FOREIGN KEY ("listId") REFERENCES "PlanningList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanningItemLink" ADD CONSTRAINT "PlanningItemLink_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "PlanningItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
