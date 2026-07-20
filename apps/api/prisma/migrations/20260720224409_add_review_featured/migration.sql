-- AlterTable
ALTER TABLE "CourseReview" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "featuredOrder" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "CourseReview_featuredOrder_key" ON "CourseReview"("featuredOrder");
