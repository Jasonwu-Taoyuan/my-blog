-- CreateTable
CREATE TABLE "HiddenBook" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "HiddenBook_notionId_key" ON "HiddenBook"("notionId");
