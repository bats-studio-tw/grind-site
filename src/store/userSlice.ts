import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  address: string | null;
  userName: string;
  character: number; // 0: 熊, 1: 鼠
  clickedCount: number;
  nextTarget: number;
  hat: number;
  face: number;
  totalBoxes: number;
  openedBoxes: number;
  token: string | null;
}

const initialState: UserState = {
  address: null,
  userName: "",
  character: 0,
  clickedCount: 0,
  nextTarget: 0,
  hat: 0,
  face: 0,
  totalBoxes: 0,
  openedBoxes: 0,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string | null>) => {
      state.address = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setCharacter: (state, action: PayloadAction<number>) => {
      state.character = action.payload;
    },
    setClickedCount: (state, action: PayloadAction<number>) => {
      state.clickedCount = action.payload;
    },
    setNextTarget: (state, action: PayloadAction<number>) => {
      state.nextTarget = action.payload;
    },
    setHat: (state, action: PayloadAction<number>) => {
      state.hat = action.payload;
    },
    setFace: (state, action: PayloadAction<number>) => {
      state.face = action.payload;
    },
    setTotalBoxes: (state, action: PayloadAction<number>) => {
      state.totalBoxes = action.payload;
    },
    setOpenedBoxes: (state, action: PayloadAction<number>) => {
      state.openedBoxes = action.payload;
    },
  },
});

export const {
  setAddress,
  setToken,
  setUserName,
  setCharacter,
  setClickedCount,
  setNextTarget,
  setHat,
  setFace,
  setTotalBoxes,
  setOpenedBoxes,
} = userSlice.actions;
export default userSlice.reducer;
