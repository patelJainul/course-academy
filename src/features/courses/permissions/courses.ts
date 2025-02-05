import { UserRole } from "@/drizzle/schema";

export const canCreateCourses = ({ role }: { role: UserRole | undefined }) => {
  return role === "admin";
};

export const canUpdateCourses = ({ role }: { role: UserRole | undefined }) => {
  return role === "admin";
};
export const canDeleteCourses = ({ role }: { role: UserRole | undefined }) => {
  return role === "admin";
};
