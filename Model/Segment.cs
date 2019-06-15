namespace snekdek.Model
{
    public class Segment
    {
        private static int NextSegmentId = 1;

        public int SegmentId { get; set; }

        public Segment Next { get; set; }
        public Segment Previous { get; set; }


        public Segment(Segment previous)
        {
            SegmentId = NextSegmentId++;
            Previous = previous;
        }

        public Segment()
        {
            SegmentId = NextSegmentId++;
        }


        public Coord Coord { get; set; } = new Coord();

        public bool IsHead => Previous == null;


        public Segment AddNewSegment()
        {
            if (Next != null)
            {
                return Next.AddNewSegment();
            }
            else
            {
                Next = new Segment(this);
                return Next;
            }
        }

        public void Advance(Direction dir)
        {
            if (IsHead)
            {
                switch (dir)
                {
                    case Direction.Up:
                        Coord.Y++;
                        break;
                    case Direction.Right:
                        Coord.X++;
                        break;
                    case Direction.Down:
                        Coord.Y--;
                        break;
                    case Direction.Left:
                        Coord.X--;
                        break;
                }
            }
            else
            {
                Coord.SetFrom(Previous.Coord);
            }

            if (Next != null)
            {
                Next.Advance(dir);
            }
        }
    }
}