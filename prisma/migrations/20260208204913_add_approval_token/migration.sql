/*
  Warnings:

  - A unique constraint covering the columns `[approvalToken]` on the table `FuelRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FuelRequest" ADD COLUMN     "approvalToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FuelRequest_approvalToken_key" ON "FuelRequest"("approvalToken");

-- CreateIndex
CREATE INDEX "FuelRequest_approvalToken_idx" ON "FuelRequest"("approvalToken");
