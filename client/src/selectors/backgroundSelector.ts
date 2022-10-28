import { RootState } from "../reducers/store";

export const getBackgroundMode = ({ background }: RootState) =>
  background.backgroundMode;

export const getBackgroundBlurAmount = ({ background }: RootState) =>
  background.backgroundBlurAmount;

export const getEdgeBlurAmount = ({ background }: RootState) =>
  background.edgeBlurAmount;

export const getMaskOpacity = ({ background }: RootState) =>
  background.maskOpacity;

export const getMaskBlurAmount = ({ background }: RootState) =>
  background.maskBlurAmount;
