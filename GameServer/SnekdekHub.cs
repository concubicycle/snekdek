using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using snekdek.Model;

namespace snekdek.GameServer
{
    public class SnekdekHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async void SendTick(GameState state)
        {
            var json = JsonConvert.SerializeObject(state);
            await Clients.All.SendAsync(MessageKey.Tick, json);
        }
    }
}