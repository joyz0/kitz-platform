/*
  Warnings:

  - Changed the type of `type` on the `InviteCode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "InviteCodeType" AS ENUM ('REGISTER');

-- AlterTable
ALTER TABLE "InviteCode" DROP COLUMN "type",
ADD COLUMN     "type" "InviteCodeType" NOT NULL;
