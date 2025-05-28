import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { workspace } from "../types/workspace";

interface WorkspaceState {
  selectedWS: workspace | null;
}

const initialState: WorkspaceState = {
  selectedWS: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setSelectedWS(state, action: PayloadAction<workspace>) {
      state.selectedWS = action.payload;
    },
    clearSelectedWS(state) {
      state.selectedWS = null;
    },
  },
});

export const { setSelectedWS, clearSelectedWS } = workspaceSlice.actions;
export default workspaceSlice.reducer;
