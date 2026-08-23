-- CreateTable
CREATE TABLE "BookReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notionId" TEXT NOT NULL,
    "rating" INTEGER,
    "review" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BookReview_notionId_key" ON "BookReview"("notionId");
