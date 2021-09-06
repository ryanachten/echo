import { SignalData } from "simple-peer";

export enum SignalEvent {
  SendMessage = "SendMessage",
  SendConnected = "SendConnected",
  SendNewInitiator = "SendNewInitiator",
  SendSignal = "SendSignal",
  ReceiveMessage = "ReceiveMessage",
  ReceiveNewPeer = "ReceiveNewPeer",
  ReceiveNewInitiator = "ReceiveNewInitiator",
  ReceiveSignal = "ReceiveSignal",
  ReceivePeerDisconnected = "ReceivePeerDisconnected",
}

export interface SignalRequest {
  sender: string;
  receiver: string;
  data: object;
}

export interface NewUserRequest {
  sender: string;
  receiver: string;
  data: PeerUserMetadata;
}

export interface SignalResponse {
  sender: string;
  receiver: string;
  data: SignalData;
}

export interface PeerUserMetadata {
  username: string;
}

export interface PeerDisplay {
  connectionId: string;
  user: PeerUserMetadata;
}
