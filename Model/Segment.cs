namespace snekdek.Model
{
    public class Segment
    {
        private  Segment _next;
        private  Segment _previous;


        public Segment(Segment previous)
        {
            _previous = previous;
        }

        public Segment() { }
        

        public Coord Coord { get; set; } = new Coord();

        public bool IsHead => _previous == null;

        
        public void AddNewSegment()
        {
            if (_next != null)
            {
                _next.AddNewSegment();
            }
            else 
            {
                _next = new Segment(this);                
            }
        }

        public void Advance(Direction dir)
        {
            if (IsHead)
            {
                switch(dir)
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
                Coord.SetFrom(_previous.Coord);
            }

            if (_next != null)
            {
                _next.Advance(dir);
            }
        }
    }
}