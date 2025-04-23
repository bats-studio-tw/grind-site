import {
  mysqlTable,
  varchar,
  int,
  datetime,
  serial,
  unique,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 42 }).primaryKey(), // 錢包地址 (ETH address)
  userName: varchar("user_name", { length: 50 }), // 使用者名稱
  character: int("character").default(0), // 角色 0:熊, 1:鼠
  clickedCount: int("clicked_count").default(0), // 已經點了幾次
  remainingGiftBox: int("remaining_gift_box").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const items = mysqlTable(
  "items",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }),
    slot: varchar("slot", { length: 20 }),
  },
  (table) => [unique().on(table.slot, table.name)]
);

export const userItems = mysqlTable("user_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 42 }).notNull(),
  itemId: int("item_id").notNull(),
  obtainedAt: datetime("obtained_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userEquipments = mysqlTable(
  "user_equipments",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 42 }).notNull(),
    slot: varchar("slot", { length: 20 }).notNull(), // 裝備部位
    itemId: int("item_id").notNull(),
    equippedAt: datetime("equipped_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [unique().on(table.userId, table.slot)]
);
