import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userItems, items } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

// 獲取用戶物品
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { address } = await verifyToken(token);
    const userItemsList = await db
      .select({
        id: userItems.id,
        itemId: userItems.itemId,
        obtainedAt: userItems.obtainedAt,
        name: items.name,
        slot: items.slot,
        type: items.type,
      })
      .from(userItems)
      .leftJoin(items, eq(userItems.itemId, items.id))
      .where(eq(userItems.userId, address));

    return NextResponse.json(userItemsList);
  } catch (error) {
    console.error("Get user items error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 添加用戶物品
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { address } = await verifyToken(token);
    const { itemId } = await request.json();

    // 檢查物品是否存在
    const item = await db.query.items.findFirst({
      where: eq(items.id, itemId),
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    // 添加物品到用戶物品列表
    await db.insert(userItems).values({
      id: crypto.randomUUID(),
      userId: address,
      itemId,
    });

    return NextResponse.json({ message: "Item added successfully" });
  } catch (error) {
    console.error("Add user item error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
