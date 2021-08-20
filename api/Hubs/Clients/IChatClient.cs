using System.Threading.Tasks;
using api.Models;

namespace api.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(ChatMessage message);
    }
}