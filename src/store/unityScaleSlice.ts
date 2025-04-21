import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UnityScaleState {
  scale: number;
}

const initialState: UnityScaleState = {
  scale: 1,
};

export const unityScaleSlice = createSlice({
  name: "unityScale",
  initialState,
  reducers: {
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
  },
});

export const { setScale } = unityScaleSlice.actions;
export default unityScaleSlice.reducer;
