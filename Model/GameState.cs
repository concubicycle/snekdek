using System.Collections.Generic;
using snekdek.GameServer;

namespace snekdek.Model
{
    public class GameState
    {
        public List<User> Users { get; set; } = new List<User>();
        public List<Food> AllFood { get; set; } = new List<Food>();

        public Rect GameBounds { get; set; } = new Rect(
            lowerLeft: new Coord(-50, 50),
            upperRight: new Coord(50, -50)
        );
    }
}