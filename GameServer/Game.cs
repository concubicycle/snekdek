using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using snekdek.Model;
using Microsoft.AspNetCore.SignalR;


namespace snekdek.GameServer
{
    public class Game
    {
        public event Action<GameState> OnTick;

        public TimeSpan _timeSpan = TimeSpan.FromMilliseconds(500);
        private Timer _tickTimer;


        private GameState _state = new GameState();

        public Game()
        {
            _tickTimer = new Timer(Tick, null, _timeSpan, _timeSpan);
        }

        private void Tick(object stateObj)
        {
            AdvanceUsers();
            OnTick?.Invoke(_state);
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
    }
}