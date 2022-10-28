import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext } from "react";
import {
  PeerGroupRequest,
  NewUserRequest,
  SignalEvent,
  SignalRequest,
  SignalResponse,
  ConnectedRequest,
} from "../constants/interfaces";
import { Routes } from "../constants/routes";
import { SignalPeer } from "../models/SignalPeer";
import {
  addGroup,
  removePeer,
  serviceIsReady,
  setGroupError,
} from "../reducers/peerSlice";
import { store } from "../reducers/store";

export class SignalService {
  public stream: MediaStream | undefined;
  public connection: HubConnection | undefined;
  public groupCode: string | undefined;
  public peers: Array<SignalPeer> = [];
  private loggingEnabled: boolean = false;

  constructor() {
    this.init();
  }

  public sendNewGroup(groupName: string) {
    if (this.connection) {
      this.connection.send(SignalEvent.SendNewGroup, {
        sender: this.connection.connectionId,
        data: {
          groupName,
        },
      } as PeerGroupRequest);
    }
  }

  public sendAddToGroup(groupCode: string) {
    if (this.connection) {
      this.connection.send(SignalEvent.SendAddToGroup, {
        sender: this.connection.connectionId,
        data: {
          groupCode,
        },
      } as PeerGroupRequest);
    }
  }

  public sendConnection() {
    if (this.connection) {
      this.connection.send(SignalEvent.SendConnected, {
        sender: this.connection.connectionId,
        groupCode: this.groupCode,
        data: {
          userName: store.getState().user.userName,
        },
      } as ConnectedRequest);
    }
  }

  public enableAudioStream(value: boolean) {
    const tracks = this.stream?.getAudioTracks();
    tracks?.forEach((track) => {
      track.enabled = value;
    });
  }

  // This doesn't seem to work with CanvasCaptureMediaStreamTrack
  // hence the current workaround in VideoCanvas muting video and rendering empty frames
  public enableVideoStream(value: boolean) {
    const tracks = this.stream?.getVideoTracks();
    tracks?.forEach((track) => {
      track.enabled = value;
    });
  }

  private async init() {
    await this.initSignalConnection();
    this.registerEventListeners();

    store.dispatch(serviceIsReady());
  }

  private async initSignalConnection() {
    const connection = new HubConnectionBuilder()
      .withUrl(`https://localhost:5001${Routes.StreamHub}`)
      .withAutomaticReconnect()
      .build();

    await connection.start();

    this.connection = connection;
  }

  private registerEventListeners() {
    if (this.connection && this.connection.connectionId) {
      const connection = this.connection as HubConnection;
      // Set peer ID to signalR connection ID
      const peerId = this.connection.connectionId;
      this.log("peerId", peerId);

      connection.on(
        SignalEvent.ReceivePeerGroup,
        (response: PeerGroupRequest) => {
          this.groupCode = response.data.groupCode;
          store.dispatch(addGroup(response.data));
        }
      );

      connection.on(
        SignalEvent.ReceivePeerGroupNotFound,
        (response: PeerGroupRequest) => {
          store.dispatch(
            setGroupError(`Call with code ${response.data.groupCode} not found`)
          );
        }
      );

      connection.on(SignalEvent.ReceiveNewPeer, (peer: NewUserRequest) => {
        const newPeer = new SignalPeer({
          id: peer.sender,
          connection,
          stream: this.stream,
          userMetadata: peer.data,
        });
        this.addPeer(newPeer);
        this.log("new peer", peer);

        connection.send(SignalEvent.SendNewInitiator, {
          sender: peerId,
          receiver: peer.sender,
          data: {
            userName: store.getState().user.userName,
          },
        } as NewUserRequest);
      });

      connection.on(SignalEvent.ReceiveNewInitiator, (peer: NewUserRequest) => {
        this.log("new initiator", peer);
        const newPeer = new SignalPeer({
          id: peer.sender,
          initiator: true,
          connection,
          stream: this.stream,
          userMetadata: peer.data,
        });
        this.addPeer(newPeer);
      });

      // When we receive a signal from signalR, we apply to peer
      connection.on(SignalEvent.ReceiveSignal, (signal: SignalResponse) =>
        this.getPeerById(signal.sender)?.instance.signal(signal.data)
      );

      connection.on(
        SignalEvent.ReceivePeerDisconnected,
        (request: SignalRequest) => {
          const peer = this.getPeerById(request.sender);
          if (peer) {
            this.destroyPeer(peer);
          }
        }
      );
    }
  }

  private addPeer = (peer: SignalPeer) => {
    let peers = [...this.peers];
    const existingPeer = peers.find((x) => x.id === peer.id);
    if (existingPeer) {
      peers = peers.filter((x) => x.id !== peer.id);
    }
    this.peers = [...peers, peer];
  };

  private destroyPeer = (peer: SignalPeer) => {
    peer.instance.destroy();
    this.peers = [...this.peers].filter((x) => x.id !== peer.id);
    store.dispatch(removePeer(peer.id));
  };

  private getPeerById = (id: string) => this.peers.find((x) => x.id === id);

  private log = (...args: any[]) =>
    this.loggingEnabled && console.log(`SignalService:\n`, ...args);
}

export const serviceSignalInstance = new SignalService();
export const SignalContext = createContext<SignalService>(
  serviceSignalInstance
);
