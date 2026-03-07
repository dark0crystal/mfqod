-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PENDING', 'APPROVED', 'DISPOSED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "status" "PostStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN "approvedClaimId" TEXT,
ADD COLUMN "disposalTitle" TEXT,
ADD COLUMN "disposalDescription" TEXT,
ADD COLUMN "disposalHow" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Post_approvedClaimId_key" ON "Post"("approvedClaimId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_approvedClaimId_fkey" FOREIGN KEY ("approvedClaimId") REFERENCES "Claim"("id") ON DELETE SET NULL ON UPDATE CASCADE;
