import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UserTable } from "./users";
import { ProductTable } from "./products";
import { relations } from "drizzle-orm";

export const PurchaseTable = pgTable("purchases", {
  id,
  pricePaidInCents: integer().notNull(),
  productDetails: jsonb().notNull().$type<{
    name: string;
    description: string;
    imageUrl: string;
  }>(),
  userId: uuid()
    .notNull()
    .references(() => UserTable.id),
  productId: uuid()
    .notNull()
    .references(() => ProductTable.id),
  stripeSessionId: text().notNull().unique(),
  refundedAt: timestamp({ withTimezone: true }),
  createdAt,
  updatedAt,
});

export const PurchaseTableRelationships = relations(
  PurchaseTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [PurchaseTable.userId],
      references: [UserTable.id],
    }),
    product: one(ProductTable, {
      fields: [PurchaseTable.userId],
      references: [ProductTable.id],
    }),
  })
);
