export default class CoordPlayerLookup {
    constructor(players, allFood) {
        this.map = new Map();
        this.coordToFood =  new Map();

        players.forEach(player => {
            this.recureseSegments(player, player.head, this.map);
        });

        allFood.forEach(food => {
            var id = this.coord_id(food.coords);
            this.coordToFood.set(id, food);
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

    foodForCoords(coords) {
        const id = this.coord_id(coords);
        return this.coordToFood.get(id);
    }

    coord_id = (coords) => `(${coords.x},${coords.y})`;
}