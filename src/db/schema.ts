import { mysqlTable, varchar, int, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 42 }).primaryKey(), // 錢包地址 (ETH address)
  userName: varchar("user_name", { length: 50 }), // 使用者名稱
  character: int("character").default(0), // 角色 0:熊, 1:鼠
  clickedCount: int("clicked_count").default(0), // 已經點了幾次
  nextTarget: int("next_target").default(0), // 下一個的禮物點擊次數
  totalBoxes: int("total_boxes").default(0),
  openedBoxes: int("opened_boxes").default(0),
  createdAt: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const items = mysqlTable("items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 50 }),
  slot: varchar("slot", { length: 20 }), // hat, face, body, etc.
  type: int("type").default(0), // 0: 帽子, 1: 臉飾, 2: 身體, etc.
});

export const userItems = mysqlTable("user_items", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 42 }).notNull(),
  itemId: varchar("item_id", { length: 36 }).notNull(),
  obtainedAt: datetime("obtained_at").default(sql`CURRENT_TIMESTAMP`),
});

export const userEquipments = mysqlTable("user_equipments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("user_id", { length: 42 }).notNull(),
  slot: varchar("slot", { length: 20 }).notNull(), // 裝備部位
  itemId: varchar("item_id", { length: 36 }).notNull(), // 裝備的物品ID
  equippedAt: datetime("equipped_at").default(sql`CURRENT_TIMESTAMP`),
});
