-- Country: ensure nameEn is populated, then drop name and rely on nameEn
UPDATE "Country" SET "nameEn" = "name" WHERE "nameEn" IS NULL;
ALTER TABLE "Country" ALTER COLUMN "nameEn" SET NOT NULL;
DROP INDEX IF EXISTS "Country_name_key";
ALTER TABLE "Country" DROP COLUMN IF EXISTS "name";
CREATE UNIQUE INDEX "Country_nameEn_key" ON "Country"("nameEn");

-- Branch: ensure nameEn is populated, then drop name
UPDATE "Branch" SET "nameEn" = "name" WHERE "nameEn" IS NULL;
ALTER TABLE "Branch" ALTER COLUMN "nameEn" SET NOT NULL;
ALTER TABLE "Branch" DROP COLUMN IF EXISTS "name";
