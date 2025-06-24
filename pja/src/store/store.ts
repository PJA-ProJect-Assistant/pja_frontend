import { configureStore } from "@reduxjs/toolkit";
import workspaceReducer from "./workspaceSlice";
import authReducer from "./authSlice";
import erdReducer from "./erdSlice";

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    auth: authReducer,
    erd: erdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
