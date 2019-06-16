using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using snekdek.Model;

namespace snekdek.GameServer
{
    public class SnekdekHub : Hub
    {
        private static readonly ConcurrentDictionary<string, User> ClientToUser =
            new ConcurrentDictionary<string, User>();

        private DefaultContractResolver _contractResolver = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy()
        };


        private readonly Game _game;

        public SnekdekHub(Game game)
        {
            _game = game;
        }

        public async Task UserJoinMessage(string userJoinJson)
        {
            var settings = new JsonSerializerSettings()
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            var userJoin = JsonConvert.DeserializeObject<UserJoin>(userJoinJson, settings);

            var user = _game.AddUser(userJoin);
            
            ClientToUser[Context.ConnectionId] = user;

            var userJson = Serialize(user);

            await Clients.All.SendAsync(MessageKey.UserJoin, userJson);
        }

        public void PlayerInputMessage(int dir)
        {
            var user = ClientToUser[Context.ConnectionId];
            user.Direction = (Direction) dir;
        }

        public override async Task OnDisconnectedAsync(System.Exception exception)
        {
            var user = ClientToUser[Context.ConnectionId];

            await base.OnDisconnectedAsync(exception);

            ClientToUser.TryRemove(Context.ConnectionId, out user);

            if (user != null) {
                _game.RemoveUser(user);
            }
        }

        private string Serialize<T>(T obj)
        {
            return JsonConvert.SerializeObject(obj, new JsonSerializerSettings
            {
                ContractResolver = _contractResolver,
                Formatting = Formatting.None
            });
        }
    }
}