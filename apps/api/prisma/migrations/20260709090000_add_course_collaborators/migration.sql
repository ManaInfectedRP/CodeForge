-- CreateTable
CREATE TABLE "CourseCollaborator" (
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseCollaborator_pkey" PRIMARY KEY ("courseId","userId")
);

-- AddForeignKey
ALTER TABLE "CourseCollaborator" ADD CONSTRAINT "CourseCollaborator_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseCollaborator" ADD CONSTRAINT "CourseCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
