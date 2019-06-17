// import(/* webpackChunkName: "pixi-sound" */ 'pixi-sound').then(({ default: PixiSound }) => {
//     GameSound.score = PixiSound.Sound.from('wav/score.wav');
//     GameSound.one = PixiSound.Sound.from('mp3/1.mp3');
    
// }).catch(error => 'An error occurred while loading the component');

import PixiSound from 'pixi-sound';

export default class GameSound {
    static one = PixiSound.Sound.from('mp3/1.mp3');
    static score = PixiSound.Sound.from('wav/score.wav'); 
}


