import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  CourseTable,
  LessonTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import {
  getCourseSectionGlobalTag,
  getCourseSectionsCourseIdTag,
} from "@/features/courseSections/db/cache";
import {
  getLessonCourseIdTag,
  getLessonGlobalTag,
} from "@/features/lessons/db/cache/lessons";
import { asc, countDistinct, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getCourseGlobalTag,
  getCourseIdTag,
  revalidateCourseCache,
} from "./cache/cache";
import { getUserCourseAccessGlobalTag } from "./cache/userCourseAccess";

export const getCourse = async (courseId: string) => {
  "use cache";
  cacheTag(
    getCourseIdTag(courseId),
    getCourseSectionsCourseIdTag(courseId),
    getLessonCourseIdTag(courseId)
  );

  return db.query.CourseTable.findFirst({
    columns: { id: true, name: true, description: true },
    where: eq(CourseTable.id, courseId),
    with: {
      courseSections: {
        orderBy: asc(CourseSectionTable.order),
        columns: { id: true, name: true, order: true, status: true },
        with: {
          lessons: {
            orderBy: asc(LessonTable.order),
            columns: {
              id: true,
              name: true,
              order: true,
              status: true,
              sectionId: true,
              description: true,
              videoUrl: true,
            },
          },
        },
      },
    },
  });
};

export const getCourseList = async () => {
  "use cache";
  cacheTag(
    getCourseGlobalTag(),
    getUserCourseAccessGlobalTag(),
    getCourseSectionGlobalTag(),
    getLessonGlobalTag()
  );

  return db
    .select({
      id: CourseTable.id,
      name: CourseTable.name,
      description: CourseTable.description,
      createdAt: CourseTable.createdAt,
      updatedAt: CourseTable.updatedAt,
      sectionCount: countDistinct(CourseSectionTable),
      lessonCount: countDistinct(LessonTable),
      studentCount: countDistinct(UserCourseAccessTable),
    })
    .from(CourseTable)
    .leftJoin(
      CourseSectionTable,
      eq(CourseSectionTable.courseId, CourseTable.id)
    )
    .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
    .leftJoin(
      UserCourseAccessTable,
      eq(UserCourseAccessTable.courseId, CourseTable.id)
    )
    .orderBy(asc(CourseTable.name))
    .groupBy(CourseTable.id);
};

export const insertCourse = async (data: typeof CourseTable.$inferInsert) => {
  const [newCourse] = await db.insert(CourseTable).values(data).returning();
  if (!newCourse) throw new Error("Failed to insert course");

  revalidateCourseCache(newCourse.id);
  return newCourse;
};

export const updateCourse = async (
  { courseId }: { courseId: string },
  data: Partial<typeof CourseTable.$inferInsert>
) => {
  const [updatedCourse] = await db
    .update(CourseTable)
    .set(data)
    .where(eq(CourseTable.id, courseId))
    .returning();

  if (!updatedCourse) throw new Error("Failed to update course");

  revalidateCourseCache(updatedCourse.id);
  return updatedCourse;
};

export const deleteCourse = async ({ id }: { id: string }) => {
  const [deletedCourse] = await db
    .delete(CourseTable)
    .where(eq(CourseTable.id, id))
    .returning();
  if (!deletedCourse) throw new Error("Failed to delete course");

  revalidateCourseCache(deletedCourse.id);
  return deletedCourse;
};
