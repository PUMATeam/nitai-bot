const Telegram  = require('telegram-node-bot');
const NitaiBaseController = require('./NitaiBaseController.js');
const winston = require('winston');
const moment = require('moment');

class TimeController extends NitaiBaseController {
    
    constructor(database) {
        super();
        this.started = false;
        this.currentDocument = {};
        this.database = database;
    }

    handleTime($) {
        let command = $.query.command;

        switch (command) {
            case 'started': this.logStartingTime($);
                break;
            case 'finished': this.logFinishingTime($);
                break;
        }
    }

    logStartingTime($)  {
        let date = $._update.message.date;
        let startingTime = moment.unix(date).format('HH:mm:ss');
        this.currentDocument.starting_time = date;
        let result = database.saveDocument(this.currentDocument);
        winston.log('debug', `Result: ${result}`);
    }

    logFinishingTime($) {
        winston.log('info', $);
    }

    get routes() {
        return {
            '/time :command': 'handleTime'
        }
    }
}

module.exports = TimeController;