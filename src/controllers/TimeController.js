const Telegram  = require('telegram-node-bot');
const NitaiBaseController = require('./NitaiBaseController.js');

let started = false;;
class TimeController extends NitaiBaseController {

    menuHandler($) {
        console.log($.Update);
        if (started) {
            $.runMenu({
                layout: 1,
                message: 'Has Nitai finished ',
                'Nitai has finished eating: ': () => {},
                oneTimeKeyboard: true
            });
            started = false;
        } else {
            $.runMenu({
                layout: 1,
                message: 'Has Nitai started ',
                'Nitai has started eating, bom apetite': () => {},
                oneTimeKeyboard: true
            });
            started = true;
        }
        
    }

    get routes() {
        return {
            'time': 'menuHandler'
        }
    }
}

module.exports = TimeController;