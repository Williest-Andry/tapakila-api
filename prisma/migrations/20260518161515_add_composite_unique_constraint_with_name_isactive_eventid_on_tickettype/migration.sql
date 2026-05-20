/*
  Warnings:

  - A unique constraint covering the columns `[name,isActive,eventId]` on the table `TicketType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TicketType_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "TicketType_name_isActive_eventId_key" ON "TicketType"("name", "isActive", "eventId");
