import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userEquipments, items } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

// 獲取用戶裝備
export async function GET(request: NextRequest) {
  try {
    // 從 Authorization header 中獲取 token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    const address = payload.address;

    const equipments = await db
      .select({
        id: userEquipments.id,
        slot: userEquipments.slot,
        itemId: userEquipments.itemId,
        item: {
          id: items.id,
          name: items.name,
          slot: items.slot,
        },
      })
      .from(userEquipments)
      .leftJoin(items, eq(userEquipments.itemId, items.id))
      .where(eq(userEquipments.userId, address));

    return NextResponse.json(equipments);
  } catch (error) {
    console.error("Get user equipments error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 裝備/更換裝備
export async function POST(request: NextRequest) {
  try {
    // 從 Authorization header 中獲取 token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    const address = payload.address;

    const { slot, itemId } = await request.json();

    // 檢查物品是否存在且屬於該用戶
    const item = await db.query.items.findFirst({
      where: eq(items.id, itemId),
    });

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    // 檢查該部位是否已有裝備
    const existingEquipment = await db.query.userEquipments.findFirst({
      where: and(
        eq(userEquipments.userId, address),
        eq(userEquipments.slot, slot)
      ),
    });

    if (existingEquipment) {
      // 更新現有裝備
      await db
        .update(userEquipments)
        .set({ itemId })
        .where(eq(userEquipments.id, existingEquipment.id));
    } else {
      // 添加新裝備
      await db.insert(userEquipments).values({
        userId: address,
        slot,
        itemId,
      });
    }

    return NextResponse.json({ message: "Equipment updated successfully" });
  } catch (error) {
    console.error("Update equipment error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 卸下裝備
export async function DELETE(request: NextRequest) {
  try {
    // 從 Authorization header 中獲取 token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    const address = payload.address;

    const { slot } = await request.json();

    await db
      .delete(userEquipments)
      .where(
        and(eq(userEquipments.userId, address), eq(userEquipments.slot, slot))
      );

    return NextResponse.json({ message: "Equipment removed successfully" });
  } catch (error) {
    console.error("Remove equipment error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
