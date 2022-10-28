import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CallState {
  videoMuted: boolean;
}

export const initialCallState: CallState = {
  videoMuted: false,
};

export const callSlice = createSlice({
  name: "call",
  initialState: initialCallState,
  reducers: {
    updateVideoMuted: (state, action: PayloadAction<boolean>) => {
      state.videoMuted = action.payload;
    },
  },
});

export const { updateVideoMuted } = callSlice.actions;

export default callSlice.reducer;
