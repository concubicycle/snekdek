

namespace snekdek.Model
{
    public class User
    {
        public string Name { get; set; }
        public Segment Head { get; set; } = new Segment();
    }
}
