-- Drop old string columns and rename enum columns
ALTER TABLE "User" DROP COLUMN "role";
ALTER TABLE "User" ALTER COLUMN "roleEnum" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "roleEnum" SET DEFAULT 'WORKER';
ALTER TABLE "User" RENAME COLUMN "roleEnum" TO "role";

ALTER TABLE "Order" DROP COLUMN "status";
ALTER TABLE "Order" ALTER COLUMN "statusEnum" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "statusEnum" SET DEFAULT 'PENDING';
ALTER TABLE "Order" RENAME COLUMN "statusEnum" TO "status";

ALTER TABLE "Product" DROP COLUMN "type";
ALTER TABLE "Product" ALTER COLUMN "typeEnum" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "typeEnum" SET DEFAULT 'NEON';
ALTER TABLE "Product" RENAME COLUMN "typeEnum" TO "type";

ALTER TABLE "Product" DROP COLUMN "status";
ALTER TABLE "Product" ALTER COLUMN "statusEnum" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "statusEnum" SET DEFAULT 'ACTIVE';
ALTER TABLE "Product" RENAME COLUMN "statusEnum" TO "status";

ALTER TABLE "ProductionStage" DROP COLUMN "status";
ALTER TABLE "ProductionStage" ALTER COLUMN "statusEnum" SET NOT NULL;
ALTER TABLE "ProductionStage" ALTER COLUMN "statusEnum" SET DEFAULT 'PLANNED';
ALTER TABLE "ProductionStage" RENAME COLUMN "statusEnum" TO "status";

ALTER TABLE "Task" DROP COLUMN "status";
ALTER TABLE "Task" ALTER COLUMN "statusEnum" SET NOT NULL;
ALTER TABLE "Task" ALTER COLUMN "statusEnum" SET DEFAULT 'PENDING';
ALTER TABLE "Task" RENAME COLUMN "statusEnum" TO "status";
