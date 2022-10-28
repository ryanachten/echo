import { RootState } from "../reducers/store";

export const getVideoMuted = ({ call }: RootState) => call.videoMuted;
