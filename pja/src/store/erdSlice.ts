import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ErdState {
    erdId: number | null;
}

const initialState: ErdState = {
    erdId: null,
};

const erdSlice = createSlice({
    name: "erd",
    initialState,
    reducers: {
        setErdID(state, action: PayloadAction<number | null>) {
            state.erdId = action.payload;
        },
        clearErdID(state) {
            state.erdId = null;
        },
    },
});

export const { setErdID, clearErdID } = erdSlice.actions;
export default erdSlice.reducer;