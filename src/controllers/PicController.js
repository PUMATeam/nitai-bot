const Telegram  = require('telegram-node-bot');
const NitaiBaseController = require('./NitaiBaseController.js');

class PicController extends NitaiBaseController {
    handle($){
        if ($._message._photo != null ){
            $.sendMessage('image');
        }
    }
}

module.exports = PicController;