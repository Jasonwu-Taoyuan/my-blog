-- RenameColumn (review -> notes) and AddColumn (summary)
ALTER TABLE "BookReview" RENAME COLUMN "review" TO "notes";
ALTER TABLE "BookReview" ADD COLUMN "summary" TEXT;
