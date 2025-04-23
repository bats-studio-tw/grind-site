import { db } from "@/db";
import { items } from "@/db/schema";

async function seedItems() {
  await db.insert(items).values([
    { name: "Red Hat", slot: "head" },
    { name: "Blue Cap", slot: "head" },
    { name: "Round Glasses", slot: "face" },
    { name: "Pixel Shades", slot: "face" },
  ]);

  console.log("✅ Seed complete");
}

seedItems().catch(console.error);
