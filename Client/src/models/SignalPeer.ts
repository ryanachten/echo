import { HubConnection } from "@microsoft/signalr";
import Peer, { Instance } from "simple-peer";
import { SignalRequest, SignalEvent } from "../constants/interfaces";

export interface SignalPeerConfig {
  id: string;
  connection: HubConnection;
  initiator?: boolean;
  stream?: MediaStream;
}

export class SignalPeer {
  public id: string;
  public instance: Instance;
  private connection: HubConnection;

  constructor(config: SignalPeerConfig) {
    const { id, connection, initiator, stream } = config;
    this.id = id;
    this.connection = connection;
    this.instance = new Peer({
      initiator,
      stream,
    });

    this.registerEventListeners();
  }

  private registerEventListeners() {
    // When peer receives a signal, transmit it via signalR
    this.instance.on("connect", () => console.log("Peer connected", this.id));

    // When peer receives a signal, transmit it via signalR
    this.instance.on("signal", (data) =>
      this.connection.send(SignalEvent.SendSignal, {
        receiver: this.id,
        data,
      } as SignalRequest)
    );

    // When a peer receives a stream event, setup video playback
    this.instance.on("stream", (stream) => this.initVideoPlayback(stream));
  }

  private initVideoPlayback(stream: MediaStream) {
    const videos = document.querySelector(".videos");

    if (videos === null) {
      return console.error("No video element found");
    }

    const videoEl = document.createElement("video");
    const existingEl = document.getElementById(stream.id);
    if (existingEl) return;

    console.log("assigned video to stream", this.id, stream);

    videoEl.id = this.id;
    videoEl.srcObject = stream;

    videos.append(videoEl);

    videoEl.play();
  }
}