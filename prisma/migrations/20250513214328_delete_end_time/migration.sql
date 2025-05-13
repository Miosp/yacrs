/*
  Warnings:

  - You are about to drop the column `endTime` on the `Screening` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Screening" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startTime" DATETIME NOT NULL,
    "auditoriumId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    CONSTRAINT "Screening_auditoriumId_fkey" FOREIGN KEY ("auditoriumId") REFERENCES "Auditorium" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Screening_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Screening" ("auditoriumId", "id", "movieId", "startTime") SELECT "auditoriumId", "id", "movieId", "startTime" FROM "Screening";
DROP TABLE "Screening";
ALTER TABLE "new_Screening" RENAME TO "Screening";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
