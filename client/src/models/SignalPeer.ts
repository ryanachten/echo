import { HubConnection } from "@microsoft/signalr";
import Peer, { Instance } from "simple-peer";
import {
  SignalRequest,
  SignalEvent,
  PeerUserMetadata,
} from "../constants/interfaces";
import { addPeer } from "../reducers/peerSlice";
import { store } from "../reducers/store";

export interface SignalPeerConfig {
  id: string;
  connection: HubConnection;
  userMetadata: PeerUserMetadata;
  initiator?: boolean;
  stream?: MediaStream;
}

export class SignalPeer {
  public id: string;
  public instance: Instance;
  private connection: HubConnection;
  public stream: MediaStream | undefined = undefined;
  public userMetadata: PeerUserMetadata;

  constructor(config: SignalPeerConfig) {
    const { id, connection, initiator, stream, userMetadata } = config;
    this.id = id;
    this.connection = connection;
    this.userMetadata = userMetadata;
    this.instance = new Peer({
      initiator,
      stream,
    });

    this.registerEventListeners();
  }

  private registerEventListeners() {
    // When peer receives a signal, transmit it via signalR
    this.instance.on("signal", (data) =>
      this.connection.send(SignalEvent.SendSignal, {
        receiver: this.id,
        data,
      } as SignalRequest)
    );

    // When a peer receives a stream event, setup video playback
    this.instance.on("stream", (stream) => {
      this.stream = stream;
      store.dispatch(
        addPeer({
          connectionId: this.id,
          user: this.userMetadata,
        })
      );
    });
  }
}
