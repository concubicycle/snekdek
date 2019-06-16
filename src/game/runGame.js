import * as SignalR from '@aspnet/signalr';

import '../css/style.css';
import GameLoop from '../game/GameLoop';
import loadImages from '../utils/loadImages';

import 'pixi-sound';

const runGame = (name) => {
    loadImages([
        'block.png',
        'square.png',
        'food.png',
        'wall.png'
    ]).then(onResourcesReady)
}

function onResourcesReady(sprites) {
    const userId = guid();
    const userJoin = { name, userId };
    let state = {};

    let connection = new SignalR.HubConnectionBuilder()
    .withUrl('/snekdekHub')
    .build();
    
    function onPlayerDied() {        
        window.onbeforeunload = null;
        document.removeEventListener('keydown', press);
        connection.stop();

        const game = document.getElementById('game');
        game.classList.add('hidden');

        const retry = document.getElementById('retry');
        retry.classList.remove('hidden');
    }


    const gameEl = document.getElementById('game');
    gameEl.classList.remove('hidden');

    const game = new GameLoop(sprites, onPlayerDied);


    connection.on("tick", data => {
        state = JSON.parse(data);

        var localUser = state.users.find(u => u.userId == userId);

        if (!localUser) {
            return;
        }

        game.refresh(state, localUser);
    });

    connection.on("userjoin", userJson => {
        const user = JSON.parse(userJson);

        if (user.userId != userId) {
            state.users.push(user)
            game.refresh(state);
        }
    });

    connection.start().then(() => {
        connection.invoke("UserJoinMessage", JSON.stringify(userJoin)).catch(function (err) {
            return console.error(err.toString());
        });
    });       

    function press(e) {
        if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */) {
            connection.invoke("PlayerInputMessage", 0).catch(function (err) {
                return console.error(err.toString());
            });
        }
        if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
            connection.invoke("PlayerInputMessage", 1).catch(function (err) {
                return console.error(err.toString());
            });
        }
        if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {
            connection.invoke("PlayerInputMessage", 2).catch(function (err) {
                return console.error(err.toString());
            });
        }
        if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */) {
            connection.invoke("PlayerInputMessage", 3).catch(function (err) {
                return console.error(err.toString());
            });
        }
    }

    document.addEventListener('keydown', press);
    window.onbeforeunload = () => {
        connection.stop();
    }
}


function guid(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, guid) }

export default runGame;