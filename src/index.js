import setupLogin from './game/login'

import {utils} from 'pixi.js'

// prevent caching images when developing
utils.clearTextureCache();


setupLogin();