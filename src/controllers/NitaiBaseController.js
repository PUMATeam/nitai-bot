const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const winston = require('winston');

class NitaiBaseController extends TelegramBaseController {
    before(command, scope) {
        winston.level = 'debug';
        winston.log('debug',scope.message);

        return scope;
    }
}

module.exports = NitaiBaseController;