using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Echo.Models;
using Echo.Hubs.Clients;
using System.Collections.Generic;
using System;

namespace Echo.Hubs
{
    public class StreamHub : Hub<IStreamHub>
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
        public static List<PeerGroup> PeerGroups = new List<PeerGroup>();

        public override Task OnConnectedAsync()
        {
            ConnectedIds.Add(Context.ConnectionId);

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            ConnectedIds.Remove(Context.ConnectionId);
            Clients.All.ReceivePeerDisconnected(new DisconnectionResponse(Context.ConnectionId));
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendNewGroup(PeerGroupRequest request)
        {
            Console.WriteLine($"\n New group received: ${request.Data.GroupName} \n");

            var groupCode = new GroupCode().Value;
            var peerGroup = new PeerGroup(request.Data.GroupName, groupCode);
            // TODO: we should really be cleaning up unused group codes from this list
            // after they are no longer used
            PeerGroups.Add(peerGroup);

            await Clients.Caller.ReceivePeerGroup(new PeerGroupRequest(request.Sender, peerGroup));
        }

        public async Task SendAddToGroup(PeerGroupRequest request)
        {
            Console.WriteLine($"\n Adding group: user ${request.Sender} to group ${request.Data.GroupName} \n");

            var peerGroup = PeerGroups.Find(x => x.GroupCode == request.Data.GroupCode);
            if (peerGroup == null)
            {
                await Clients.Caller.ReceivePeerGroupNotFound(request);
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, request.Data.GroupCode);

            await Clients.Caller.ReceivePeerGroup(new PeerGroupRequest(request.Sender, peerGroup));
        }

        public async Task SendConnected(PeerConnectionRequest peer)
        {
            Console.WriteLine($"\n New peer connected: ${peer.Sender} \n");
            await Clients.OthersInGroup(peer.GroupCode).ReceiveNewPeer(peer);
        }

        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }

        public async Task SendNewInitiator(SignalRequest peer)
        {
            Console.WriteLine($"\nSendNewInitiator: ${peer.Sender}\n");

            await Clients.Client(peer.Receiver).ReceiveNewInitiator(peer);
        }

        //  Send message to client to initiate a connection
        //  The sender has already setup a peer connection receiver
        public async Task SendSignal(SignalRequest request)
        {
            // sender = connection ID -> receiver = receiver in payload
            Console.WriteLine($"\nSendSignal: from ${Context.ConnectionId} to ${request.Receiver} ${request.Data.ToString()}\n");

            await Clients.Client(request.Receiver).ReceiveSignal(new SignalRequest(Context.ConnectionId, request.Data));
        }
    }
}