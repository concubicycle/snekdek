import { Application, Loader, Sprite, TilingSprite } from 'pixi.js';

const loader = Loader.shared;

/// Takes an array of image paths, ands loads them
const loadImages = (paths) => new Promise((resolve, reject) => {
    const sprites = {};
    const ids = [];

    for(const p of paths) {
        const id = pathToId(p);
        ids.push(id);
        loader.add(id, p);
        console.log(`adding ${p} as ${id}`)
    }

    loader.onError.add(() => console.log('problem loading images'));    

    loader.load((loader, resources) => {
        const spriteCreators = ids.map(id => ({[id]: () => new TilingSprite(resources[id].texture) }));
        const spriteFactory = Object.assign({}, ...spriteCreators)        
        resolve(spriteFactory);
    })
});

// by default, the file name without extension is used as id
function pathToId (fullPath) {
    const filename = fullPath.replace(/^.*[\\\/]/, '');
    return filename.replace(/\..+$/, '');
}


export default loadImages;