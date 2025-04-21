export type EquipmentSlot = "hat" | "face" | "body" | "accessory";

export interface Equipment {
  id: string;
  userId: string;
  slot: EquipmentSlot;
  itemId: string;
  equippedAt: Date;
}

export interface EquipmentWithItem extends Equipment {
  name: string;
  type: number;
}
