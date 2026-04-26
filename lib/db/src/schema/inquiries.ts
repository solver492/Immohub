import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const inquiriesTable = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Inquiry = typeof inquiriesTable.$inferSelect;
export type InsertInquiry = typeof inquiriesTable.$inferInsert;
