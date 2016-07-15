const Telegram  = require('telegram-node-bot');
const NitaiBaseController = require('./NitaiBaseController.js');

class PingController extends NitaiBaseController {
    pingHandler($) {
        $.sendMessage('pong');
    }

    get routes() {
        return {
            'ping': 'pingHandler'
        }
    }
}

module.exports = PingController;