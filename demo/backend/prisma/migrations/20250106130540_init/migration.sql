-- CreateTable
CREATE TABLE "document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "create_time" TEXT NOT NULL,
    "content" TEXT
);

INSERT INTO "document" ("id", "name", "create_time") VALUES ('184858c4-be37-41b5-af82-52689004e605', 'test name', '2025-01-10T08:17:40.106Z');
