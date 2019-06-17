import(/* webpackChunkName: "pixi-sound" */ 'pixi-sound').then(({ default: PixiSound }) => {
    GameSound.score = PixiSound.Sound.from('wav/score.wav');
}).catch(error => 'An error occurred while loading the component');

export default class GameSound {
    static score = null; 
}


