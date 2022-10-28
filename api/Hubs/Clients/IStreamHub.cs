using System.Threading.Tasks;
using Echo.Models;

namespace Echo.Hubs.Clients
{
    public interface IStreamHub
    {
        Task ReceiveMessage(ChatMessage message);
        Task ReceivePeerGroup(PeerGroupRequest group);
        Task ReceivePeerGroupNotFound(PeerGroupRequest group);
        Task ReceiveNewPeer(PeerConnectionRequest peer);
        Task ReceiveNewInitiator(SignalRequest peer);
        Task ReceiveSignal(SignalRequest stream);
        Task ReceivePeerDisconnected(DisconnectionResponse peer);
    }
}