-- CreateTable
CREATE TABLE "PageViewDaily" (
    "path" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PageViewDaily_pkey" PRIMARY KEY ("path","date")
);
