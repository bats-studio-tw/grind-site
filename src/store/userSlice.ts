import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  address: string;
  userName: string;
  character: number; // 0: 熊, 1: 鼠
  clickedCount: number;
  remainingGiftBox: number;
  token: string | null;
}

const initialState: UserState = {
  address: "",
  userName: "",
  character: 0,
  clickedCount: 0,
  remainingGiftBox: 0,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
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
    setRemainingGiftBox: (state, action: PayloadAction<number>) => {
      state.remainingGiftBox = action.payload;
    },
  },
});

export const {
  setAddress,
  setToken,
  setUserName,
  setCharacter,
  setClickedCount,
  setRemainingGiftBox,
} = userSlice.actions;
export default userSlice.reducer;
