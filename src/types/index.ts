export interface UserData {
  address: string;
  userName: string;
  character: string;
  clickedCount: number;
  nextTarget: number;
  totalBoxes: number;
  openedBoxes: number;
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
