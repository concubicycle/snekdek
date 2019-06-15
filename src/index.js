import { Application, Loader, Sprite } from 'pixi.js';
import * as SignalR from '@aspnet/signalr';
import SnekdekApplication from './utils/SnekdekApplication';
import './css/style.css';

// let connection = new SignalR.HubConnectionBuilder()
//     .withUrl("http://localhost:5000")
//     .build();
 
// connection.on("send", data => {
//     console.log(data);
// });
 
// connection.start().then(() => connection.invoke("send", "Hello"));


// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new SnekdekApplication();