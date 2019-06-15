using System;

namespace snekdek.Model
{
    public class Coord : IEquatable<Coord>
    {
        public int X { get; set; }
        public int Y { get; set; }

        public bool Equals(Coord other)
        {
            return X == other.X && Y == other.Y;
        }

        public void SetFrom(Coord other)
        {
            X = other.X;
            Y = other.Y;
        }
    }
}