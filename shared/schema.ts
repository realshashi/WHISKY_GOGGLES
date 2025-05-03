import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Original users table (keeping for reference)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// New schema for Whisky Goggles
export const bottles = pgTable("bottles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  size: integer("size"),
  proof: doublePrecision("proof"),
  abv: doublePrecision("abv"),
  spirit_type: text("spirit_type"),
  brand_id: integer("brand_id"),
  popularity: integer("popularity"),
  image_url: text("image_url"),
  avg_msrp: doublePrecision("avg_msrp"),
  fair_price: doublePrecision("fair_price"),
  shelf_price: doublePrecision("shelf_price"),
  total_score: integer("total_score"),
  wishlist_count: integer("wishlist_count"),
  vote_count: integer("vote_count"),
  bar_count: integer("bar_count"),
  ranking: integer("ranking"),
});

export const insertBottleSchema = createInsertSchema(bottles);
export type InsertBottle = z.infer<typeof insertBottleSchema>;
export type Bottle = typeof bottles.$inferSelect;

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id"),
  bottle_id: integer("bottle_id").notNull(),
  store_price: doublePrecision("store_price"),
  location: text("location"),
  created_at: timestamp("created_at").defaultNow(),
  confidence: doublePrecision("confidence"),
});

export const insertScanSchema = createInsertSchema(scans).omit({ 
  id: true,
  created_at: true 
});

export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scans.$inferSelect;
