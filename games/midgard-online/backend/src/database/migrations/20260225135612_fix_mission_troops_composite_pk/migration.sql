/*
  Warnings:

  - The primary key for the `mission_troops` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `mission_troops` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "mission_troops_mission_id_idx";

-- AlterTable
ALTER TABLE "mission_troops" DROP CONSTRAINT "mission_troops_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "mission_troops_pkey" PRIMARY KEY ("mission_id", "troop_type");
