import { UserRole } from "@/drizzle/schema";
import { getUser } from "@/features/users/db/users";
import { auth, clerkClient } from "@clerk/nextjs/server";

const client = await clerkClient();

export const getCurrentUser = async ({ allData = false } = {}) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId,
    role: sessionClaims?.role,
    user:
      allData && sessionClaims?.dbId != null
        ? await getUser(sessionClaims?.dbId)
        : undefined,
    redirectToSignIn,
  };
};

export const syncClerkMetadata = async (user: {
  id: string;
  clerkUserId: string;
  role: UserRole;
}) => {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  });
};
