import "dotenv/config";
import { db } from "./index";
import { items } from "./schema";

async function seed() {
  const hatItems = Array.from({ length: 5 }, (_, i) => ({
    name: `0${i + 1}`,
    slot: "Hat",
  }));

  const faceItems = Array.from({ length: 5 }, (_, i) => ({
    name: `0${i + 1}`,
    slot: "Face",
  }));

  await db.insert(items).values([...hatItems, ...faceItems]);
}

seed()
  .then(() => {
    console.log("Seed completed successfully");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  });
