"use server";

import { z } from "zod";
import { courseSchema } from "../schemas/courses";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk";
import {
  canCreateCourses,
  canDeleteCourses,
  canUpdateCourses,
} from "../permissions/courses";
import { deleteCourse, insertCourse, updateCourse } from "../db/courses";

export const createCourseAction = async (
  unsafeData: z.infer<typeof courseSchema>
) => {
  const { success, data } = courseSchema.safeParse(unsafeData);
  if (!success || !canCreateCourses(await getCurrentUser())) {
    return { error: true, message: "There was an error creating course" };
  }

  const course = await insertCourse(data);

  redirect(`/admin/courses/${course.id}/edit`);
};

export const updateCourseAction = async (
  id: string,
  unsafeData: z.infer<typeof courseSchema>
) => {
  const { success, data } = courseSchema.safeParse(unsafeData);
  if (!success || !id || !canUpdateCourses(await getCurrentUser())) {
    return { error: true, message: "There was an error creating course" };
  }

  await updateCourse({ courseId: id }, data);
  return { error: false, message: "Successfully updated course" };
};

// const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const deleteCourseAction = async (id: string) => {
  if (!canDeleteCourses(await getCurrentUser())) {
    return { error: true, message: "Error deleting course" };
  }

  await deleteCourse({ id });
  return { error: false, message: "Successfully deleted course" };
};
