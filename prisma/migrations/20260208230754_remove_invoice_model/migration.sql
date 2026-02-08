/*
  Warnings:

  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_requestId_fkey";

-- AlterTable
ALTER TABLE "FuelRequest" ADD COLUMN     "approvedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Invoice";
