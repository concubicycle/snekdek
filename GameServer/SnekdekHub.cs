using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace snekdek.GameServer
{
    public class SnekdekHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}