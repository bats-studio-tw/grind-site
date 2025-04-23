import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";
import {
  calculateCurrentClickTarget,
  shouldRewardGiftBox,
} from "@/lib/gameUtils";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { address } = await verifyToken(token);
    const { clickCount } = await request.json();

    console.log("Received click update request:", { address, clickCount });

    // Get current user data
    const user = await db.query.users.findFirst({
      where: eq(users.id, address),
    });

    if (!user) {
      console.error("User not found:", address);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("Current user data:", user);

    // Check if we should reward a gift box
    const shouldReward = shouldRewardGiftBox(
      clickCount,
      user.clickedCount ?? 0
    );
    console.log("Should reward gift box:", shouldReward);

    // Update user data
    const updatedUser = await db
      .update(users)
      .set({
        clickedCount: clickCount,
        remainingGiftBox: shouldReward
          ? (user.remainingGiftBox ?? 0) + 1
          : user.remainingGiftBox ?? 0,
      })
      .where(eq(users.id, address));

    console.log("Updated user data:", updatedUser);

    const { currentClickTarget, nextClickTarget } =
      calculateCurrentClickTarget(clickCount);

    return NextResponse.json({
      clickCount,
      currentClickTarget,
      nextClickTarget,
      remainingGiftBox: shouldReward
        ? (user.remainingGiftBox ?? 0) + 1
        : user.remainingGiftBox ?? 0,
      shouldReward,
    });
  } catch (error) {
    console.error("Update click count error:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
