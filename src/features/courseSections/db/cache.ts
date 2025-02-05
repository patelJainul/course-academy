import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getCourseSectionGlobalTag = () => {
  return getGlobalTag("courseSections");
};

export const getCourseSectionIdTag = (id: string) => {
  return getIdTag("courseSections", id);
};

export const getCourseSectionsCourseIdTag = (courseId: string) => {
  return getIdTag("courseSections", courseId);
};

export const revalidateUserCourseAccessCache = ({
  id,
  courseId,
}: {
  id: string;
  courseId: string;
}) => {
  revalidateTag(getCourseSectionGlobalTag());
  revalidateTag(getCourseSectionIdTag(id));
  revalidateTag(getCourseSectionsCourseIdTag(courseId));
};
