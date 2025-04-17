import { mysqlTable, varchar, int, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 42 }).primaryKey(), // 錢包地址 (ETH address)
  totalBoxes: int("total_boxes").default(0),
  openedBoxes: int("opened_boxes").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const items = mysqlTable("items", {
  id: varchar("id", { length: 50 }).primaryKey(), // 如 "head-1"
  name: varchar("name", { length: 255 }),
  slot: varchar("slot", { length: 50 }),
});

export const userItems = mysqlTable("user_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 42 }).notNull(),
  itemId: varchar("item_id", { length: 36 }).notNull(),
  obtainedAt: datetime("obtained_at").default(sql`CURRENT_TIMESTAMP`),
});
