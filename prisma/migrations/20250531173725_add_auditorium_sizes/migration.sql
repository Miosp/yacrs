/*
  Warnings:

  - Added the required column `rows` to the `Auditorium` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatsPerRow` to the `Auditorium` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auditorium" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "displayName" TEXT NOT NULL,
    "seatPrice" DECIMAL NOT NULL DEFAULT 10.00,
    "rows" INTEGER NOT NULL,
    "seatsPerRow" INTEGER NOT NULL
);
INSERT INTO "new_Auditorium" ("displayName", "id", "seatPrice", "rows", "seatsPerRow") 
SELECT 
    a."displayName", 
    a."id", 
    a."seatPrice",
    COALESCE(MAX(s."row"), 1) as "rows",
    COALESCE(MAX(s."seatNumber"), 1) as "seatsPerRow"
FROM "Auditorium" a
LEFT JOIN "Seat" s ON a."id" = s."auditoriumId"
GROUP BY a."id", a."displayName", a."seatPrice";
DROP TABLE "Auditorium";
ALTER TABLE "new_Auditorium" RENAME TO "Auditorium";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
