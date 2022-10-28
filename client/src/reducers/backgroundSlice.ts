import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideoBackgroundMode } from "../constants/interfaces";

export interface BackgroundState {
  backgroundMode: VideoBackgroundMode;
  backgroundBlurAmount: number;
  edgeBlurAmount: number;
  maskOpacity: number;
  maskBlurAmount: number;
}

export const initialBackgroundState: BackgroundState = {
  backgroundMode: VideoBackgroundMode.None,
  backgroundBlurAmount: 10,
  edgeBlurAmount: 7,
  maskOpacity: 0.7,
  maskBlurAmount: 5,
};

export const backgroundSlice = createSlice({
  name: "background",
  initialState: initialBackgroundState,
  reducers: {
    updateBackgroundMode: (
      state,
      action: PayloadAction<VideoBackgroundMode>
    ) => {
      state.backgroundMode = action.payload;
    },
    updateBackgroundBlurAmount: (state, action: PayloadAction<number>) => {
      state.backgroundBlurAmount = action.payload;
    },
    updateEdgeBlurAmount: (state, action: PayloadAction<number>) => {
      state.edgeBlurAmount = action.payload;
    },
    updateMaskOpacity: (state, action: PayloadAction<number>) => {
      state.maskOpacity = action.payload;
    },
    updateMaskBlurAmount: (state, action: PayloadAction<number>) => {
      state.maskBlurAmount = action.payload;
    },
  },
});

export const {
  updateBackgroundMode,
  updateBackgroundBlurAmount,
  updateEdgeBlurAmount,
  updateMaskOpacity,
  updateMaskBlurAmount,
} = backgroundSlice.actions;

export default backgroundSlice.reducer;
