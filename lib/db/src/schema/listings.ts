import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  doublePrecision,
  uuid,
} from "drizzle-orm/pg-core";

export const listingsTable = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  transaction: text("transaction").notNull(),
  propertyType: text("property_type").notNull(),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("MAD"),
  city: text("city").notNull(),
  neighborhood: text("neighborhood").notNull(),
  address: text("address"),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  area: integer("area").notNull().default(0),
  images: text("images").array().notNull().default([]),
  videoUrl: text("video_url"),
  features: text("features").array().notNull().default([]),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone").notNull(),
  contactEmail: text("contact_email").notNull(),
  agencyName: text("agency_name"),
  featured: boolean("featured").notNull().default(false),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Listing = typeof listingsTable.$inferSelect;
export type InsertListing = typeof listingsTable.$inferInsert;
