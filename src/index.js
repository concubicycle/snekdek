import * as SignalR from '@aspnet/signalr';

import './css/style.css';
import GameLoop from './game/GameLoop';
import loadImages from './utils/loadImages';

let connection = new SignalR.HubConnectionBuilder()
    .withUrl('/snekdekHub')
    .build();

connection.on("tick", data => {
    console.log(data);
});

connection.start().then(() => connection.invoke("send", "Hello"));


loadImages([
    'block.png',
    'square.png'
]).then((sprites) => {
    const game = new GameLoop(sprites);
})

