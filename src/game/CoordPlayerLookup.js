export default class CoordPlayerLookup {
    constructor(players) {
        this.map = new Map();

        players.forEach(player => {
            this.recureseSegments(player, player.head, this.map);
        });
    }

    recureseSegments(player, segment, map) {
        const id = this.coord_id(segment.coords);
        map.set(id, player);        

        if (segment.next != null)
            this.recureseSegments(player, segment.next, map);
    }

    playerForCoords(coords) {
        const id = this.coord_id(coords);
        return this.map.get(id);
    }

    coord_id = (coords) => `(${coords.x},${coords.y})`;
}