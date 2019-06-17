using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using snekdek.Model;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using snekdek.Utils;

namespace snekdek.GameServer
{
    public class Game
    {
        public const int MaxFood = 50;
        public TimeSpan _timeSpan = TimeSpan.FromMilliseconds(210);
        private Timer _tickTimer;

        public TimeSpan _foodSpawnInterval = TimeSpan.FromSeconds(4);
        private Timer _foodTimer;

        private IHubContext<SnekdekHub> _hub;

        private readonly JsonParser _parser;

        private object _stateLock = new Object();
        private GameState _state = new GameState();

        public Game(IHubContext<SnekdekHub> hub, JsonParser parser)
        {
            _hub = hub;
            _parser = parser;
        }

        public void Start()
        {
            _tickTimer = new Timer(Tick, null, _timeSpan, _timeSpan);
            _foodTimer = new Timer(SpawnFood, null, TimeSpan.FromSeconds(3), _foodSpawnInterval);
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
                json = _parser.Serialize(_state);
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
                boundingRect.ExpandX(200);

            if (boundingRect.SpanY < 20)
                boundingRect.ExpandY(200);

            var foodCount = 10;
            lock (_stateLock)
            {
                while (foodCount-- > 0)
                {
                    var foodCoord = boundingRect.RandomInnerPoint();

                    if (_state.GameBounds.Contains(foodCoord))
                    {
                        var food = new Food { Coords = foodCoord };
                        _state.AllFood.Add(food);
                    }
                }
            }
        }

        private List<Coord> FindAllOccupiedCoords()
        {
            var allSegmentCoords = new List<Coord>();
            lock (_stateLock)
            {
                //@TODO: optimize?
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
                    user.Direction = user.PendingDirection;

                    user.Advance();                    

                    // This is O(N^bad). needs optimization
                    foreach (var otherUser in _state.Users)
                    {
                        if (otherUser == user && user.HeadIntersectsNonHead(otherUser)) 
                            user.State = UserState.Dead;                        
                        else if (otherUser != user && user.HeadIntersects(otherUser))
                            user.State = UserState.Dead;
                    }

                    var matchedFood = _state.AllFood.FirstOrDefault(f => user.HeadIntersects(f.Coords));
                    if(matchedFood != null)
                    {
                        user.AddSegment();
                        _state.AllFood.Remove(matchedFood);
                    }

                    var outOfBounds = !_state.GameBounds.Contains(user.Head.Coords);
                    if (outOfBounds) 
                        user.State = UserState.Dead;
                }
            }
        }
    }
}