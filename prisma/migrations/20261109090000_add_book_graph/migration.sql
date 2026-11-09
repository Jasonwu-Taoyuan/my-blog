-- CreateTable
CREATE TABLE "BookConcept" (
    "id" TEXT NOT NULL,
    "notionId" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookGraphProcessed" (
    "notionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookGraphProcessed_pkey" PRIMARY KEY ("notionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookConcept_notionId_concept_key" ON "BookConcept"("notionId", "concept");

-- CreateIndex
CREATE INDEX "BookConcept_concept_idx" ON "BookConcept"("concept");
