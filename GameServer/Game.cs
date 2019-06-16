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
        public const int MaxFood = 50;


        private DefaultContractResolver _contractResolver = new DefaultContractResolver
        {
            NamingStrategy = new CamelCaseNamingStrategy()
        };

        public TimeSpan _timeSpan = TimeSpan.FromMilliseconds(500);
        private Timer _tickTimer;

        public TimeSpan _foodSpawnInterval = TimeSpan.FromSeconds(4);
        private Timer _foodTimer;

        private IHubContext<SnekdekHub> _hub;

        private object _stateLock = new Object();
        private GameState _state = new GameState();

        public Game(IHubContext<SnekdekHub> hub)
        {
            _hub = hub;
        }

        public void Start()
        {
            _tickTimer = new Timer(Tick, null, _timeSpan, _timeSpan);
            _foodTimer = new Timer(SpawnFood, null, TimeSpan.FromSeconds(15), _foodSpawnInterval);
        }

        public User AddUser(UserJoin userJoin)
        {
            var user = new User
            {
                Direction = Direction.Up,
                Name = userJoin.Name,
                UserId = userJoin.UserId
            };

            lock (_stateLock)
            {
                _state.Users.Add(user);
            }

            return user;
        }

        public void RemoveUser(User user)
        {
            lock (_stateLock)
            {
                _state.Users.Remove(user);
            }
        }


        private async void Tick(object stateObj)
        {
            AdvanceUsers();
            string json;
            lock (_stateLock)
            {
                json = Serialize(_state);
            }
            await _hub.Clients.All.SendAsync(MessageKey.Tick, json);
        }

        private void SpawnFood(object stateObj)
        {
            lock (_stateLock)
            {
                if (_state.AllFood.Count >= MaxFood) return;
            }

            
            var occupiedCoords = FindAllOccupiedCoords();
            var boundingRect = new Rect(occupiedCoords);

            if (boundingRect.SpanX < 20)
            {
                boundingRect.MinX -= 50;
                boundingRect.MaxX += 50;
            }

            if (boundingRect.SpanY < 20)
            {
                boundingRect.MinY -= 50;
                boundingRect.MaxY += 50;
            }

            var foodCount = 10;
            lock (_stateLock)
            {
                while (foodCount-- > 0)
                {
                    var foodCoord = boundingRect.RandomInnerPoint();
                    var food = new Food { Coords = foodCoord };
                    _state.AllFood.Add(food);
                }
            }
        }

        private List<Coord> FindAllOccupiedCoords()
        {
            var allSegmentCoords = new List<Coord>();
            lock (_stateLock)
            {
                //@TODO: refactor (durr)
                // find all coords
                foreach (var user in _state.Users)
                {
                    var cursor = user.Head;

                    while (cursor != null)
                    {
                        allSegmentCoords.Add(cursor.Coords);
                        cursor = cursor.Next;
                    }
                }
            }
            return allSegmentCoords;
        }



        private void AdvanceUsers()
        {
            lock (_stateLock)
            {
                foreach (var user in _state.Users)
                {
                    user.Advance();
                    var otherUsers = _state.Users.Where(u => u != user);

                    // This is O(n^2) and bad. 
                    foreach (var otherUser in otherUsers)
                        if (user.HeadIntersects(otherUser))
                            user.State = UserState.Dead;
                    
                    var newFood = new List<Food>();

                    foreach (var food in _state.AllFood) 
                        if (user.HeadIntersects(food.Coords))
                            user.Head.AddNewSegment();
                        else
                            newFood.Add(food);

                    _state.AllFood = newFood;
                }
            }
        }

        private string Serialize<T>(T obj)
        {
            lock (_stateLock)
            {
                return JsonConvert.SerializeObject(_state, new JsonSerializerSettings
                {
                    ContractResolver = _contractResolver,
                    Formatting = Formatting.None
                });
            }
        }
    }
}