-- Project submission review: students submit a link for a lesson, an
-- instructor approves it or requests changes.
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'CHANGES_REQUESTED');

ALTER TABLE "Lesson" ADD COLUMN "requiresSubmission" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "ProjectSubmission" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submissionUrl" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "feedback" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectSubmission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProjectSubmission_lessonId_userId_key" ON "ProjectSubmission"("lessonId", "userId");

ALTER TABLE "ProjectSubmission" ADD CONSTRAINT "ProjectSubmission_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectSubmission" ADD CONSTRAINT "ProjectSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
