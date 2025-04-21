import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { abstractTestnet } from "viem/chains";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { address, signature, message } = await request.json();

    // 驗證輸入數據
    if (!address || !signature || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 驗證地址格式
    if (!address.startsWith("0x") || address.length !== 42) {
      return NextResponse.json(
        { message: "Invalid address format" },
        { status: 400 }
      );
    }

    // 驗證簽名格式
    if (!signature.startsWith("0x")) {
      return NextResponse.json(
        { message: "Invalid signature format" },
        { status: 400 }
      );
    }

    console.log("Verifying signature for address:", address);
    console.log("Message:", message);
    console.log("Signature:", signature);

    try {
      // Create a public client to verify the message
      const publicClient = createPublicClient({
        chain: abstractTestnet,
        transport: http(),
      });

      // Verify the message using the public client
      const isValid = await publicClient.verifyMessage({
        address,
        message,
        signature,
      });

      if (!isValid) {
        return NextResponse.json(
          { message: "Invalid signature" },
          { status: 401 }
        );
      }
    } catch (verifyError) {
      console.error("Signature verification error:", verifyError);
      return NextResponse.json(
        { message: "Signature verification failed" },
        { status: 400 }
      );
    }

    // 檢查使用者是否存在，如果不存在則創建
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, address),
    });

    if (!existingUser) {
      await db.insert(users).values({
        id: address,
      });
    }

    // 生成 JWT
    const token = await signToken({ address });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
