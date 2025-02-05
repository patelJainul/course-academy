import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getCourseGlobalTag = () => {
  return getGlobalTag("courses");
};

export const getCourseIdTag = (id: string) => {
  return getIdTag("courses", id);
};

export const revalidateCourseCache = (id: string) => {
  revalidateTag(getCourseGlobalTag());
  revalidateTag(getCourseIdTag(id));
};
