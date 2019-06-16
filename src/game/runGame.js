import * as SignalR from '@aspnet/signalr';

import '../css/style.css';
import GameLoop from '../game/GameLoop';
import loadImages from '../utils/loadImages';

import 'pixi-sound';


const runGame = (name) => {
    loadImages([
        'block.png',
        'square.png'
    ]).then((sprites) => {

        const userId = guid();
        const userJoin = { name, userId };

        let state = {};

        const game = new GameLoop(sprites);

        let connection = new SignalR.HubConnectionBuilder()
            .withUrl('/snekdekHub')
            .build();
      
        connection.on("tick", data => {            
            state = JSON.parse(data);

            var localUser = state.users.find(u => u.userId == userId);

            if(!localUser) {
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
    })

}

function guid(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, guid) }

export default runGame;