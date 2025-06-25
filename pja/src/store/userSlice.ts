import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userId: string | null;
}

const initialState: UserState = {
    userId: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserId(state, action: PayloadAction<string | null>) {
            state.userId = action.payload;
            if (action.payload) {
                console.log("action.payload : ", action.payload);
                localStorage.setItem("userId", action.payload);
            } else {
                localStorage.removeItem("userId");
            }
        },
        clearUserId(state) {
            state.userId = null;
            localStorage.removeItem("userId");
        },
    },
});

export const { setUserId, clearUserId } = userSlice.actions;
export default userSlice.reducer;
