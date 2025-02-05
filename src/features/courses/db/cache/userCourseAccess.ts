import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getUserCourseAccessGlobalTag = () => {
  return getGlobalTag("userCourseAccess");
};

export const getUserCourseAccessIdTag = ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  return getIdTag("userCourseAccess", `course:${courseId}-user:${userId}`);
};

export const revalidateUserCourseAccessCache = ({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) => {
  revalidateTag(getUserCourseAccessGlobalTag());
  revalidateTag(getUserCourseAccessIdTag({ courseId, userId }));
};
