using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using snekdek.Model;

namespace snekdek.GameServer
{
    public class Rect
    {
        public int MinX { get; set; }
        public int MinY { get; set;}
        public int MaxX { get; set;}
        public int MaxY { get; set; }

        public int SpanX => MaxX - MinX;
        public int SpanY => MaxY - MinY;

        public Rect(IEnumerable<Coord> coords)
        {   
            if(coords == null || coords.Count() == 0) return;

            var first = coords.First();
            MinX = MaxX = first.X;
            MinY = MaxY = first.Y;

            foreach(var c in coords)
            {
                if (c.X < MinX)
                    MinX = c.X;
                if (c.X > MaxX)
                    MaxX = c.X;
                if (c.Y < MinY)
                    MinY = c.Y;
                if (c.Y > MaxY)
                    MaxY = c.Y;
            }
        }

        public Coord RandomInnerPoint()
        {
            Random rnd = new Random();
            var x = rnd.Next(MinX, MaxX + 1);
            var y = rnd.Next(MinY, MaxY + 1);
            return new Coord { X = x, Y = y };
        }
    }
}