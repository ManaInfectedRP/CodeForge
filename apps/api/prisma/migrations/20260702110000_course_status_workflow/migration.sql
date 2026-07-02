-- Course publishing becomes a review workflow: DRAFT -> PENDING_REVIEW -> PUBLISHED
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED');

ALTER TABLE "Course" ADD COLUMN "status" "CourseStatus" NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "Course" ADD COLUMN "reviewNote" TEXT;

-- carry over previously published courses before dropping the old flag
UPDATE "Course" SET "status" = 'PUBLISHED' WHERE "published" = true;

ALTER TABLE "Course" DROP COLUMN "published";
