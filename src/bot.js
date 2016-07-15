'use strict';

var api = require('./../apikey.js');
const Telegram  = require('telegram-node-bot');
const bot = new Telegram.Telegram(api.key);

module.exports = bot;