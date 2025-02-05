import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { CourseTable } from "./courses";
import { relations } from "drizzle-orm";

export const UserCourseAccessTable = pgTable(
  "user_course_access",
  {
    userId: uuid().references(() => UserTable.id),
    courseId: uuid().references(() => CourseTable.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })]
);

export const UserCourseAccessRelationships = relations(
  UserCourseAccessTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserCourseAccessTable.userId],
      references: [UserTable.id],
    }),
    course: one(CourseTable, {
      fields: [UserCourseAccessTable.courseId],
      references: [CourseTable.id],
    }),
  })
);
