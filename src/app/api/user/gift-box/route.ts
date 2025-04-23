import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userItems, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { address } = await verifyToken(token);

    // Get user data
    const user = await db.query.users.findFirst({
      where: eq(users.id, address),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if ((user.remainingGiftBox ?? 0) <= 0) {
      return NextResponse.json(
        { message: "No gift box available" },
        { status: 400 }
      );
    }

    // Get all available items
    const allItems = await db.query.items.findMany();
    if (!allItems || allItems.length === 0) {
      return NextResponse.json(
        { message: "No items available" },
        { status: 500 }
      );
    }

    // Randomly select an item
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];

    // Start a transaction
    await db.transaction(async (tx) => {
      // Add item to user's inventory
      await tx.insert(userItems).values({
        userId: address,
        itemId: randomItem.id,
      });

      // Update remaining gift box count
      await tx
        .update(users)
        .set({
          remainingGiftBox: (user.remainingGiftBox ?? 0) - 1,
        })
        .where(eq(users.id, address));
    });

    return NextResponse.json({
      item: {
        id: randomItem.id,
        name: randomItem.name,
        slot: randomItem.slot,
      },
      remainingGiftBox: (user.remainingGiftBox ?? 0) - 1,
    });
  } catch (error) {
    console.error("Open gift box error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
