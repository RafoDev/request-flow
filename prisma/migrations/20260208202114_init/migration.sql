-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "FuelRequest" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "workerName" TEXT NOT NULL,
    "workerDNI" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FuelRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FuelRequest_status_idx" ON "FuelRequest"("status");

-- CreateIndex
CREATE INDEX "FuelRequest_createdAt_idx" ON "FuelRequest"("createdAt");
