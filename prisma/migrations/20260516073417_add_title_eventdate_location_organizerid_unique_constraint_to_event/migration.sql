/*
  Warnings:

  - A unique constraint covering the columns `[title,eventDate,location,organizerId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_title_eventDate_location_organizerId_key" ON "Event"("title", "eventDate", "location", "organizerId");
