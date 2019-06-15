//cache for sprites

export default class SpritePool {
    constructor(spriteFactory) {
        this.spriteFactory = spriteFactory;        
    }

    unusedSprites = {};
    usedSprites = {};

    get(id) {
        if (this.unusedSprites[id] == null) {
            this.unusedSprites[id] = [];
            this.usedSprites[id] = [];
            return this.newSprite(id);
        }

        if (this.unusedSprites[id].length == 0) {
            return this.newSprite(id);
        }

        const spr = this.unusedSprites[id].pop();
        spr.visible = true;
        return spr;
    }

    newSprite(id) {
        var spr = this.spriteFactory(id);
        this.usedSprites[id].push(spr);
        return spr;
    }

    returnAll () {
        for (const id in this.usedSprites) {
            while (this.usedSprites.length > 0) {
                const sprite = this.usedSprites[id].pop();
                sprite.visible = false;
                this.unusedSprites[id].push(sprite);
            }
        }        
    }
}