-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placeName" TEXT NOT NULL,
    "country" TEXT,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "visitedAt" DATETIME,
    "note" TEXT,
    "coverImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Trip_country_idx" ON "Trip"("country");
