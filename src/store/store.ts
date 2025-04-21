import { configureStore } from "@reduxjs/toolkit";
import unityScaleReducer from "./unityScaleSlice";

export const store = configureStore({
  reducer: {
    unityScale: unityScaleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
