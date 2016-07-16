const Telegram  = require('telegram-node-bot');
const NitaiBaseController = require('./NitaiBaseController.js');
const winston = require('winston');
const moment = require('moment');
const util = require('util');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

class TimeController extends NitaiBaseController {
    
    constructor(database) {
        super();
        this.currentDocument = {};
        this.database = database;

    }

    handleTime($) {
        let command = $.query.command;
        let date = $._update.message.date;
        let username = $._update.message._from._username
      
        switch (command) {
            case 'started': this.logStartingTime($, date, username);
                break;
            case 'finished': this.logFinishingTime($, date, username);
                break;
        }
    }

    logStartingTime($, date, username)  {
        let startingTime = moment.unix(date).format('HH:mm:ss');

        winston.log('info', `Started: logged at ${startingTime} by ${username}`);
    
        $.sendMessage(`Nitai has started eating at ${startingTime}. Logged by ${username}`);

        this.currentDocument.starting_time = date;
        this.currentDocument.user_id = username;
        
        this.database.saveDocument(this.currentDocument).then((result) => {
            $.chatSession.lastId = result.id;
        }).catch((err) => {
            winston.error(`Saving document failed: ${err}`);
        });
    }

    logFinishingTime($, date, username) {
        let endingTime = moment.unix(date).format('HH:mm:ss');

        winston.log('info', `Finished: logged at ${endingTime} by ${username}`);
        $.sendMessage(`Nitai has finished eating at ${endingTime}. Logged by ${username}`);
        
        this.database.getRowById($.chatSession.lastId).then((result) => {
            this.currentDocument = result;
        }).catch((err) => {
            winston.error(`Getting row failed: ${err}`);
        });

        this.currentDocument.ending_time = date;
        winston.log('info', `Last food_log id  ${$.chatSession.lastId}`);

        this.database.saveDocument(this.currentDocument);
    }

    get routes() {
        return {
            '/time :command': 'handleTime'
        }
    }
}

module.exports = TimeController;