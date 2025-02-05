import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { LessonTable } from "./lesson";
import { relations } from "drizzle-orm";

export const UserLessonCompletedTable = pgTable(
  "user_lesson_completed",
  {
    userId: uuid()
      .notNull()
      .references(() => UserTable.id),
    lessonId: uuid()
      .notNull()
      .references(() => LessonTable.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })]
);

export const UserLessonTableRelationship = relations(
  UserLessonCompletedTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserLessonCompletedTable.userId],
      references: [UserTable.id],
    }),
    lesson: one(LessonTable, {
      fields: [UserLessonCompletedTable.lessonId],
      references: [LessonTable.id],
    }),
  })
);
