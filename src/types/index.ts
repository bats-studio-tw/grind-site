export interface UserData {
  address: string;
  userName: string;
  character: number;
  clickedCount: number;
  remainingGiftBox: number;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  slot: string;
}

export interface UserEquipment {
  id: string;
  userId: string;
  slot: string;
  itemId: string;
  equippedAt: string;
  item?: Item;
}
