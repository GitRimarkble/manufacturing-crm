-- Create enum types
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'WORKER');
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED');
    CREATE TYPE "ProductType" AS ENUM ('NEON', 'LED');
    CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DISCONTINUED');
    CREATE TYPE "ProductionStageStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED');
    CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new enum columns
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "roleEnum" "UserRole";
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "statusEnum" "OrderStatus";
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "typeEnum" "ProductType";
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "statusEnum" "ProductStatus";
ALTER TABLE "ProductionStage" ADD COLUMN IF NOT EXISTS "statusEnum" "ProductionStageStatus";
ALTER TABLE "Task" ADD COLUMN IF NOT EXISTS "statusEnum" "TaskStatus";

-- Migrate data to enum columns
UPDATE "User" SET "roleEnum" = 
    CASE "role"
        WHEN 'ADMIN' THEN 'ADMIN'::"UserRole"
        WHEN 'MANAGER' THEN 'MANAGER'::"UserRole"
        ELSE 'WORKER'::"UserRole"
    END;

UPDATE "Order" SET "statusEnum" = 
    CASE "status"
        WHEN 'PENDING' THEN 'PENDING'::"OrderStatus"
        WHEN 'IN_PRODUCTION' THEN 'IN_PRODUCTION'::"OrderStatus"
        WHEN 'COMPLETED' THEN 'COMPLETED'::"OrderStatus"
        ELSE 'CANCELLED'::"OrderStatus"
    END;

UPDATE "Product" SET 
    "typeEnum" = CASE "type"
        WHEN 'NEON' THEN 'NEON'::"ProductType"
        ELSE 'LED'::"ProductType"
    END,
    "statusEnum" = CASE "status"
        WHEN 'ACTIVE' THEN 'ACTIVE'::"ProductStatus"
        ELSE 'DISCONTINUED'::"ProductStatus"
    END;

UPDATE "ProductionStage" SET "statusEnum" = 
    CASE "status"
        WHEN 'PLANNED' THEN 'PLANNED'::"ProductionStageStatus"
        WHEN 'IN_PROGRESS' THEN 'IN_PROGRESS'::"ProductionStageStatus"
        WHEN 'COMPLETED' THEN 'COMPLETED'::"ProductionStageStatus"
        WHEN 'DELAYED' THEN 'DELAYED'::"ProductionStageStatus"
        ELSE 'CANCELLED'::"ProductionStageStatus"
    END;

UPDATE "Task" SET "statusEnum" = 
    CASE "status"
        WHEN 'PENDING' THEN 'PENDING'::"TaskStatus"
        WHEN 'IN_PROGRESS' THEN 'IN_PROGRESS'::"TaskStatus"
        ELSE 'COMPLETED'::"TaskStatus"
    END;
