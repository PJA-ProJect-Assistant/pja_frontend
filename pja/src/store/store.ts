import { configureStore } from "@reduxjs/toolkit";
import workspaceReducer from "./workspaceSlice";
import authReducer from "./authSlice";
import erdReducer from "./erdSlice";
import userReducer from "./userSlice";
import devPageReducer from "./devPageSlice";

export const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    auth: authReducer,
    erd: erdReducer,
    user: userReducer,
    devPage: devPageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
