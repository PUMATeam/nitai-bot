const Telegram  = require('telegram-node-bot');
const NitaiBaseController = require('./NitaiBaseController.js');
const winston = require('winston');
const moment = require('moment');
const util = require('util');
const database = require('../db/database');

class TimeController extends NitaiBaseController {
    
    constructor() {
        super();
        this.currentDocument = {};
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
        
        database.insertDocument(this.currentDocument).then((id) => {
            $.chatSession.lastId = id;
        });
    } 

    logFinishingTime($, date, username) {
        let endingTime = moment.unix(date).format('HH:mm:ss');

        winston.log('info', `Finished: logged at ${endingTime} by ${username}`);
        $.sendMessage(`Nitai has finished eating at ${endingTime}. Logged by ${username}`);
        
        database.getRowById($.chatSession.lastId).then((result) => {
            this.currentDocument = result;
        }).catch((err) => {
            winston.error(`Getting row failed: ${err}`);
        });

        this.currentDocument.ending_time = date;
        winston.log('info', `Last food_log id  ${$.chatSession.lastId}`);

        database.saveDocument(this.currentDocument);
    }

    get routes() {
        return {
            '/time :command': 'handleTime'
        }
    }
}

module.exports = TimeController;