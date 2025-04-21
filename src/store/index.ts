import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import unityScaleReducer from "./unityScaleSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    unityScale: unityScaleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
