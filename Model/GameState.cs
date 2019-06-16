using System.Collections.Generic;

namespace snekdek.Model
{
    public class GameState
    {
        public List<User> Users { get; set; } = new List<User>();
        public List<Food> AllFood { get; set; } = new List<Food>();
    }
}