/*
  Warnings:

  - Added the required column `chatId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAId" INTEGER NOT NULL,
    "userBId" INTEGER NOT NULL,
    CONSTRAINT "Chat_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chat_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "maxAttendees" INTEGER,
    "category" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "chatId" INTEGER,
    CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("category", "createdAt", "creatorId", "date", "description", "id", "location", "maxAttendees", "title", "updatedAt") SELECT "category", "createdAt", "creatorId", "date", "description", "id", "location", "maxAttendees", "title", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "chatId" INTEGER NOT NULL,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("content", "createdAt", "id", "read", "receiverId", "senderId") SELECT "content", "createdAt", "id", "read", "receiverId", "senderId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Chat_userAId_idx" ON "Chat"("userAId");

-- CreateIndex
CREATE INDEX "Chat_userBId_idx" ON "Chat"("userBId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_userAId_userBId_key" ON "Chat"("userAId", "userBId");
