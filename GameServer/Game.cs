using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using snekdek.Model;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace snekdek.GameServer
{
    public class Game
    {
        private DefaultContractResolver _contractResolver = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy()
        };

        public TimeSpan _timeSpan = TimeSpan.FromMilliseconds(500);
        private Timer _tickTimer;

        private IHubContext<SnekdekHub> _hub;

        private GameState _state = new GameState();

        public Game(IHubContext<SnekdekHub> hub)
        {
            _hub = hub;
        }

        public void Start()
        {
            _tickTimer = new Timer(Tick, null, _timeSpan, _timeSpan);
        }

        public User AddUser(UserJoin userJoin)
        {
            var user = new User
            {
                Direction = Direction.Up,
                Name = userJoin.Name,
                UserId = userJoin.UserId
            };

            _state.Users.Add(user);

            return user;
        }


        private async void Tick(object stateObj)
        {
            AdvanceUsers();

            var json = Serialize(_state);
            await _hub.Clients.All.SendAsync(MessageKey.Tick, json);
        }

        private void AdvanceUsers()
        {
            foreach (var user in _state.Users)
            {
                user.Advance();
                var otherUsers = _state.Users.Where(u => u != user);

                // This is O(n^2) and bad. 
                foreach (var otherUser in otherUsers)
                    if (user.HeadIntersects(otherUser))
                        user.State = UserState.Dead;
            }
        }

        private string Serialize<T>(T obj)
        {
            return JsonConvert.SerializeObject(_state, new JsonSerializerSettings
            {
                ContractResolver = _contractResolver,
                Formatting = Formatting.None
            });
        }
    }
}