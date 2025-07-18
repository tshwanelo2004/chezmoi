import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  integer,
  jsonb,
  text,
  uuid,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  fullName: varchar("full_name", { length: 256 }),
  profilePicUrl: varchar("profile_pic_url", { length: 500 }),
  role: varchar("role", { length: 100 }).default("user"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  sessionToken: varchar("session_token", { length: 256 }).notNull().unique(),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  imageUrl: varchar("image_url", { length: 512 }),
  inventoryCount: integer("inventory_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  total: integer("total").notNull(),
  status: varchar("status", { length: 100 }).default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true }).defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  location: varchar("location", { length: 512 }),
  imageUrl: varchar("image_url", { length: 512 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  isRead: boolean("is_read")._
