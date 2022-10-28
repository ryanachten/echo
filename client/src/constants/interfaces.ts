import { SignalData } from "simple-peer";

export enum SignalEvent {
  SendMessage = "SendMessage",
  SendNewGroup = "SendNewGroup",
  SendAddToGroup = "SendAddToGroup",
  SendConnected = "SendConnected",
  SendNewInitiator = "SendNewInitiator",
  SendSignal = "SendSignal",
  ReceiveMessage = "ReceiveMessage",
  ReceivePeerGroupNotFound = "ReceivePeerGroupNotFound",
  ReceivePeerGroup = "ReceivePeerGroup",
  ReceiveNewPeer = "ReceiveNewPeer",
  ReceiveNewInitiator = "ReceiveNewInitiator",
  ReceiveSignal = "ReceiveSignal",
  ReceivePeerDisconnected = "ReceivePeerDisconnected",
}

// Generic request sent between peers
export interface SignalRequest {
  sender: string;
  receiver: string;
  data: object;
}

export interface PeerGroupRequest {
  sender: string;
  data: PeerGroupMetadata;
}

export interface NewUserRequest {
  sender: string;
  receiver: string;
  data: PeerUserMetadata;
}

export interface ConnectedRequest {
  sender: string;
  groupCode: string;
  data: PeerUserMetadata;
}

export interface SignalResponse {
  sender: string;
  receiver: string;
  data: SignalData;
}

export interface PeerGroupMetadata {
  groupName: string;
  groupCode: string;
}

export interface PeerUserMetadata {
  userName: string;
}

export interface PeerDisplay {
  connectionId: string;
  user: PeerUserMetadata;
}

export enum VideoBackgroundMode {
  None = "None",
  Blur = "Blur",
  Mask = "Mask",
}
