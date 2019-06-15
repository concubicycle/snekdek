using System.Collections.Generic;

namespace snekdek.Model
{
    public class User
    {
        public string Name { get; set; }
        public Segment Head { get; set; } = new Segment();
        public UserState State { get; set; }
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

        private bool HeadIntersectRecurse(Segment other)
        {
            if (other.Coord == Head.Coord) return true;
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
