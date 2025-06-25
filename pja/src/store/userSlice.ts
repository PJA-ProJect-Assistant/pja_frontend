import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userRole: string | null;
}

const initialState: UserState = {
  userRole: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserRole(state, action: PayloadAction<string | null>) {
      state.userRole = action.payload;
      if (action.payload) {
        console.log("action.payload : ", action.payload);
      }
    },
    clearUserRole(state) {
      state.userRole = null;
    },
  },
});

export const { setUserRole, clearUserRole } = userSlice.actions;
export default userSlice.reducer;
