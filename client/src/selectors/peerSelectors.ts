import { RootState } from "../reducers/store";

export const isServiceLoading = (state: RootState) => !state.peers.serviceReady;
export const getPeers = (state: RootState) => state.peers.peers;
export const getPeerGroup = (state: RootState) => state.peers.group;
export const getPeerGroupError = (state: RootState) => state.peers.groupError;
