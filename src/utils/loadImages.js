import { Loader, Sprite } from 'pixi.js';

const loader = Loader.shared;

// only load once, cache the output of this module
let spriteFactoryFunc = null;

/// Takes an array of image paths, ands loads them
const loadImages = (paths) => new Promise((resolve, reject) => {

    if (spriteFactoryFunc) resolve(spriteFactoryFunc);
        
    const ids = [];

    for(const p of paths) {
        const id = pathToId(p);
        ids.push(id);
        loader.add(id, p);
        console.log(`adding ${p} as ${id}`)
    }

    loader.onError.add(() => console.log('problem loading images'));    

    loader.load((loader, resources) => {
        const spriteCreators = ids.map(id => ({[id]: () => new Sprite(resources[id].texture) }));
        const spriteFactory = Object.assign({}, ...spriteCreators)

        spriteFactoryFunc = id => spriteFactory[id]();
        resolve(spriteFactoryFunc);
    })
});

// by default, the file name without extension is used as id
function pathToId (fullPath) {
    const filename = fullPath.replace(/^.*[\\\/]/, '');
    return filename.replace(/\..+$/, '');
}


export default loadImages;