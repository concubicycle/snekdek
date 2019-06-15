using System.Collections.Generic;

namespace snekdek.Model
{
    public class GameState
    {
        public List<User> Users { get; set; } = new List<User>();
        public User LocalUser { get; set; } = new User();
    }
}