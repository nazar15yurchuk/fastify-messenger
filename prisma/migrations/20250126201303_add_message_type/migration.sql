/*
  Warnings:

  - You are about to drop the column `filePath` on the `Message` table. All the data in the column will be lost.
  - Added the required column `type` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `content` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'FILE');

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "filePath",
ADD COLUMN     "type" "MessageType" NOT NULL,
ALTER COLUMN "content" SET NOT NULL;
