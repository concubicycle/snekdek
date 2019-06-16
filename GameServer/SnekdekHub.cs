using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using snekdek.Model;

namespace snekdek.GameServer
{
    public class SnekdekHub : Hub
    {
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

            var userJson = Serialize(user);

            await Clients.All.SendAsync(MessageKey.UserJoin, userJson);
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