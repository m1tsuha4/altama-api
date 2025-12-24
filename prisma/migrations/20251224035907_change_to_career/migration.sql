/*
  Warnings:

  - You are about to drop the column `growWithUsId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `growWithUsId` on the `Requirement` table. All the data in the column will be lost.
  - You are about to drop the `GrowWithUs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `careerId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `careerId` to the `Requirement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_growWithUsId_fkey";

-- DropForeignKey
ALTER TABLE "Requirement" DROP CONSTRAINT "Requirement_growWithUsId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "growWithUsId",
ADD COLUMN     "careerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Requirement" DROP COLUMN "growWithUsId",
ADD COLUMN     "careerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "GrowWithUs";

-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "overview" TEXT NOT NULL,
    "location" TEXT,
    "type" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;
