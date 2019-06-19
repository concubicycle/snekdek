import PixiSound from 'pixi-sound';

export default class GameSound {
    static one = PixiSound.Sound.from('mp3/1.mp3');
    static score = PixiSound.Sound.from('wav/score.wav'); 
    static tick = PixiSound.Sound.from('wav/tick.wav'); 
}


