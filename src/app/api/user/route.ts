import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

// 獲取用戶資料
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
    // 從 Authorization header 中獲取 token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyToken(token);
    const address = payload.address;

    const body = await request.json();

    // 只允許更新特定字段
    const allowedFields = [
      "userName",
      "character",
      "clickedCount",
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
