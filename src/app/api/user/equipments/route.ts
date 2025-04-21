import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userEquipments, items } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// 固定用戶地址，用於測試
const TEST_ADDRESS = "0x8846C613D13D6fE0AfB3E3659E228191E4B5D929";

// 獲取用戶裝備
export async function GET(request: NextRequest) {
  try {
    // 使用請求頭中的用戶地址或測試地址
    const address = request.headers.get("x-user-address") || TEST_ADDRESS;

    console.log("API route (equipments) using address:", address);

    const equipments = await db
      .select({
        slot: userEquipments.slot,
        itemId: userEquipments.itemId,
        name: items.name,
        type: items.type,
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
    // 使用請求頭中的用戶地址或測試地址
    const address = request.headers.get("x-user-address") || TEST_ADDRESS;
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
        id: crypto.randomUUID(),
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
    // 使用請求頭中的用戶地址或測試地址
    const address = request.headers.get("x-user-address") || TEST_ADDRESS;
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
