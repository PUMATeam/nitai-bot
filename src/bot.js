'use strict';
var fs = require('fs');

let api = '';

if (!fs.exists('./../apikey')) {
    api = process.env.TELEGRAM_KEY;
} else {
    api = require('./../apikey.js').key;
}

const Telegram  = require('telegram-node-bot');
const bot = new Telegram.Telegram(api);

module.exports = bot;