-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HabitCompletion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "completedDate" DATETIME NOT NULL,
    "habitId" INTEGER NOT NULL,
    CONSTRAINT "HabitCompletion_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HabitCompletion" ("completedDate", "habitId", "id") SELECT "completedDate", "habitId", "id" FROM "HabitCompletion";
DROP TABLE "HabitCompletion";
ALTER TABLE "new_HabitCompletion" RENAME TO "HabitCompletion";
CREATE TABLE "new_HabitDay" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dayOfWeek" TEXT NOT NULL,
    "habitId" INTEGER NOT NULL,
    CONSTRAINT "HabitDay_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HabitDay" ("dayOfWeek", "habitId", "id") SELECT "dayOfWeek", "habitId", "id" FROM "HabitDay";
DROP TABLE "HabitDay";
ALTER TABLE "new_HabitDay" RENAME TO "HabitDay";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
