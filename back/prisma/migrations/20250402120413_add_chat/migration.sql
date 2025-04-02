-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "eventId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatRoom_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ChatRoom_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "senderId" INTEGER NOT NULL,
    "chatRoomId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ChatParticipants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ChatParticipants_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ChatParticipants_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_eventId_key" ON "ChatRoom"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatParticipants_AB_unique" ON "_ChatParticipants"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatParticipants_B_index" ON "_ChatParticipants"("B");
