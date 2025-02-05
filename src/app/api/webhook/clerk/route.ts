import { env } from "@/data/env/server";
import { deleteUser, insertUser, updateUser } from "@/features/users/db/users";
import { syncClerkMetadata } from "@/services/clerk";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);
  let event: WebhookEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    console.error(error);
    return new Response("Error verifying webhook", {
      status: 400,
    });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const email = event.data.email_addresses.find(
        (email) => email.id === event.data.primary_email_address_id
      )?.email_address;
      const name = `${event.data.first_name} ${event.data.last_name}`.trim();
      if (email == null) return new Response("No email found", { status: 400 });
      if (name == null) return new Response("No name found", { status: 400 });

      if (event.type == "user.created") {
        const user = await insertUser({
          clerkUserId: event.data.id,
          email,
          name,
          imageUrl: event.data.image_url,
          role: "user",
        });

        await syncClerkMetadata(user);
      } else {
        await updateUser(
          { clerkUserId: event.data.id },
          {
            email,
            name,
            imageUrl: event.data.image_url,
            role: event.data.public_metadata.role,
          }
        );
      }
      break;
    }

    case "user.deleted": {
      if (event.data.id != null) {
        await deleteUser({ clerkUserId: event.data.id });
      }
      break;
    }

    default:
      break;
  }

  return new Response("OK", { status: 200 });
}
