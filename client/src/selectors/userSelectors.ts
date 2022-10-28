import { RootState } from "../reducers/store";
import { serviceSignalInstance } from "../services/SignalService";

export const getUserName = (state: RootState) =>
  state.user.userName || serviceSignalInstance.connection?.connectionId || "";
