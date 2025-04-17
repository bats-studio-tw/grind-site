import { db } from "@/db";
import { items } from "@/db/schema";

async function seedItems() {
  await db.insert(items).values([
    { id: "head-1", name: "Red Hat", slot: "head" },
    { id: "head-2", name: "Blue Cap", slot: "head" },
    { id: "face-1", name: "Round Glasses", slot: "face" },
    { id: "face-2", name: "Pixel Shades", slot: "face" },
  ]);

  console.log("✅ Seed complete");
}

seedItems().catch(console.error);
