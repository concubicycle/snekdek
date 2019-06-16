using System.Collections.Generic;

namespace snekdek.Model
{
    public class User
    {
        public string UserId { get; set; }

        public string Name { get; set; }
        public Segment Head { get; set; } = new Segment();
        public UserState State { get; set; } = UserState.Active;
        public Direction Direction { get; set; }



        public void Advance()
        {
            Head.Advance(Direction);
        }

        public void AddSegment()
        {
            var newSeg = Head.AddNewSegment();
        }

        public bool HeadIntersects(User other)
        {
            return HeadIntersectRecurse(other.Head);
        }

        public bool HeadIntersects(Coord coords)
        {
            return coords.Equals(Head.Coords);
        }

        private bool HeadIntersectRecurse(Segment other)
        {
            if (other.Coords.Equals(Head.Coords)) return true;
            if (other.Next == null) return false;
            return HeadIntersectRecurse(other.Next);
        }
    }

    public enum UserState
    {
        Active,
        Dead
    }
}
