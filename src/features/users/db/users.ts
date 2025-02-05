import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getUserIdTag, revalidateUserCache } from "./cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getUser = async (userId: string) => {
  "use cache";
  cacheTag(getUserIdTag(userId));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  });
};

export const insertUser = async (data: typeof UserTable.$inferInsert) => {
  const [newUser] = await db
    .insert(UserTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: [UserTable.clerkUserId],
      set: data,
    });
  if (!newUser) throw new Error("Failed to insert user");

  revalidateUserCache(newUser.id);
  return newUser;
};

export const updateUser = async (
  { clerkUserId }: { clerkUserId: string },
  data: Partial<typeof UserTable.$inferInsert>
) => {
  const [updatedUser] = await db
    .update(UserTable)
    .set(data)
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning();
  if (!updatedUser) throw new Error("Failed to update user");

  revalidateUserCache(updatedUser.id);
  return updatedUser;
};

export const deleteUser = async ({ clerkUserId }: { clerkUserId: string }) => {
  const [deletedUser] = await db
    .update(UserTable)
    .set({
      deletedAt: new Date(),
      name: "Deleted User",
      email: "user@deleted.com",
      clerkUserId: "deleted",
      imageUrl: null,
    })
    .where(eq(UserTable.clerkUserId, clerkUserId))
    .returning();
  if (!deletedUser) throw new Error("Failed to delete user");

  revalidateUserCache(deletedUser.id);
  return deletedUser;
};
