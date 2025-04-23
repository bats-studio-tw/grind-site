import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userEquipments, items } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { address } = await verifyToken(token);
    const body = await request.json();

    console.log("Received equip request:", { address, body });

    // Process all equipment updates in a single transaction
    await db.transaction(async (tx) => {
      // Handle each equipment slot
      for (const [slot, itemName] of Object.entries(body)) {
        if (typeof slot !== "string" || typeof itemName !== "string") {
          continue;
        }

        // If itemName is "None", unequip the item
        if (itemName === `${slot}None`) {
          await tx
            .delete(userEquipments)
            .where(
              and(
                eq(userEquipments.userId, address),
                eq(userEquipments.slot, slot)
              )
            );
          continue;
        }

        // Find the item by slot and name
        const item = await tx.query.items.findFirst({
          where: and(
            eq(items.slot, slot),
            eq(items.name, itemName.replace(slot, ""))
          ),
        });

        if (!item) {
          console.error("Item not found:", { slot, itemName });
          continue;
        }

        // Check if the user already has an item equipped in this slot
        const existingEquipment = await tx.query.userEquipments.findFirst({
          where: and(
            eq(userEquipments.userId, address),
            eq(userEquipments.slot, slot)
          ),
        });

        if (existingEquipment) {
          // Update existing equipment
          await tx
            .update(userEquipments)
            .set({ itemId: item.id })
            .where(eq(userEquipments.id, existingEquipment.id));
        } else {
          // Add new equipment
          await tx.insert(userEquipments).values({
            userId: address,
            slot,
            itemId: item.id,
          });
        }
      }
    });

    return NextResponse.json({ message: "Equipment updated successfully" });
  } catch (error) {
    console.error("Update equipment error:", error);
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
