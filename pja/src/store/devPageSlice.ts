import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface DevPageState {
  currentPage: number;
}

const initialState: DevPageState = {
  currentPage: 0,
};

const devPageSlice = createSlice({
  name: "devPage",
  initialState,
  reducers: {
    setDevPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setDevPage } = devPageSlice.actions;
export default devPageSlice.reducer;
