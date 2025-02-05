import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getLessonGlobalTag = () => {
  return getGlobalTag("lessons");
};

export const getLessonIdTag = (id: string) => {
  return getIdTag("lessons", id);
};

export const getLessonCourseIdTag = (courseId: string) => {
  return getIdTag("lessons", courseId);
};

export const revalidateLessonCache = ({
  id,
  courseId,
}: {
  id: string;
  courseId: string;
}) => {
  revalidateTag(getLessonGlobalTag());
  revalidateTag(getLessonIdTag(id));
  revalidateTag(getLessonCourseIdTag(courseId));
};
