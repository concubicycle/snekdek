namespace snekdek.Model
{
    public class Coord
    {
        public int X { get; set; }
        public int Y { get; set; }

        public void SetFrom(Coord other)
        {
            X = other.X;
            Y = other.Y;
        }
    }
}