import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// 固定用戶地址，用於測試
const TEST_ADDRESS = "0x8846C613D13D6fE0AfB3E3659E228191E4B5D929";

// 獲取用戶資料
export async function GET(request: NextRequest) {
  try {
    // 使用請求頭中的用戶地址或測試地址
    const address = request.headers.get("x-user-address") || TEST_ADDRESS;
    console.log("API route (user) using address:", address);

    const user = await db.query.users.findFirst({
      where: eq(users.id, address),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 更新用戶資料
export async function PATCH(request: NextRequest) {
  try {
    // 使用請求頭中的用戶地址或測試地址
    const address = request.headers.get("x-user-address") || TEST_ADDRESS;
    const body = await request.json();

    // 只允許更新特定字段
    const allowedFields = [
      "userName",
      "character",
      "clickedCount",
      "nextClickTarget",
      "remainingGiftBox",
    ];

    const updateData = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.includes(key))
    );

    await db.update(users).set(updateData).where(eq(users.id, address));

    // 獲取更新後的用戶資料
    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, address),
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
