-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Auditorium" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "displayName" TEXT NOT NULL,
    "seatPrice" DECIMAL NOT NULL DEFAULT 10.00
);
INSERT INTO "new_Auditorium" ("displayName", "id") SELECT "displayName", "id" FROM "Auditorium";
DROP TABLE "Auditorium";
ALTER TABLE "new_Auditorium" RENAME TO "Auditorium";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
