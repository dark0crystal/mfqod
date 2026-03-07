-- AlterTable Country: add bilingual name and description
ALTER TABLE "Country" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "Country" ADD COLUMN "nameAr" TEXT;
ALTER TABLE "Country" ADD COLUMN "descriptionEn" TEXT;
ALTER TABLE "Country" ADD COLUMN "descriptionAr" TEXT;
UPDATE "Country" SET "nameEn" = "name", "nameAr" = "name" WHERE "nameEn" IS NULL;

-- AlterTable Branch: add bilingual name and description
ALTER TABLE "Branch" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "Branch" ADD COLUMN "nameAr" TEXT;
ALTER TABLE "Branch" ADD COLUMN "descriptionEn" TEXT;
ALTER TABLE "Branch" ADD COLUMN "descriptionAr" TEXT;
UPDATE "Branch" SET "nameEn" = "name", "nameAr" = "name" WHERE "nameEn" IS NULL;
